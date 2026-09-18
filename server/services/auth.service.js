const crypto = require('node:crypto');
const { promisify } = require('node:util');
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

const scrypt = promisify(crypto.scrypt);
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64, { N: 16_384, r: 8, p: 1 });
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [, salt, expectedHex] = String(storedHash || '').split('$');
  if (!salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = await scrypt(password, salt, expected.length || 64, { N: 16_384, r: 8, p: 1 });
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function publicUser(user) {
  return {
    id: user.user_id,
    email: user.email,
    displayName: user.display_name || user.email.split('@')[0],
    avatarUrl: user.avatar_url || null,
  };
}

async function createSession(userId) {
  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  await models.AuthSession.create({
    id: tokenHash,
    user_id: userId,
    expires_at: new Date(Date.now() + SESSION_TTL_MS),
  });
  return { rawToken, maxAge: SESSION_TTL_MS / 1000 };
}

async function getUserFromSession(rawToken) {
  if (!rawToken) return null;
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const session = await models.AuthSession.findOne({
    where: { id: tokenHash },
    include: [{ model: models.UserProfile, as: 'user' }],
  });
  if (!session || session.expires_at <= new Date() || !session.user) {
    if (session) await session.destroy();
    return null;
  }
  return session.user;
}

async function register({ email, password, displayName }) {
  const normalizedEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw boom.badRequest('Introduce un correo válido.');
  if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
    throw boom.badRequest('La contraseña debe tener al menos 10 caracteres.');
  }
  const existing = await models.UserProfile.findOne({ where: { email: normalizedEmail } });
  if (existing) throw boom.conflict('Ya existe una cuenta con ese correo.');
  const user = await models.UserProfile.create({
    user_id: crypto.randomUUID(),
    email: normalizedEmail,
    password_hash: await hashPassword(password),
    display_name: String(displayName || normalizedEmail.split('@')[0]).trim().slice(0, 80),
  });
  return { user: publicUser(user), session: await createSession(user.user_id) };
}

async function login({ email, password }) {
  const user = await models.UserProfile.findOne({ where: { email: normalizeEmail(email) } });
  const valid = user && await verifyPassword(password, user.password_hash);
  if (!valid) throw boom.unauthorized('Correo o contraseña incorrectos.');
  return { user: publicUser(user), session: await createSession(user.user_id) };
}

async function revokeSession(rawToken) {
  if (!rawToken) return;
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  await models.AuthSession.destroy({ where: { id: tokenHash } });
}

async function changePassword(userId, currentPassword, newPassword) {
  if (typeof newPassword !== 'string' || newPassword.length < 10 || newPassword.length > 128) {
    throw boom.badRequest('La nueva contraseña debe tener entre 10 y 128 caracteres.');
  }
  const user = await models.UserProfile.findByPk(userId);
  if (!user || !(await verifyPassword(currentPassword, user.password_hash))) {
    throw boom.unauthorized('La contraseña actual no es correcta.');
  }
  await user.update({ password_hash: await hashPassword(newPassword) });
  await models.AuthSession.destroy({ where: { user_id: userId } });
  return createSession(userId);
}

module.exports = {
  register,
  login,
  createSession,
  getUserFromSession,
  revokeSession,
  publicUser,
  hashPassword,
  verifyPassword,
  changePassword,
  SESSION_TTL_MS,
};
