const { config } = require('../config/config');

function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  if (config.isProd) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
  }
  next();
}

function createRateLimiter({ windowMs = 60_000, max = 120 } = {}) {
  const clients = new Map();
  let lastCleanup = Date.now();

  return (req, res, next) => {
    const now = Date.now();
    if (now - lastCleanup > windowMs) {
      for (const [key, entry] of clients) {
        if (now - entry.startedAt >= windowMs) clients.delete(key);
      }
      lastCleanup = now;
    }

    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const current = clients.get(key);
    const entry = !current || now - current.startedAt >= windowMs
      ? { startedAt: now, count: 0 }
      : current;

    entry.count += 1;
    clients.set(key, entry);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));

    if (entry.count > max) {
      return res.status(429).json({ message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.' });
    }
    next();
  };
}

function requireAdmin(req, res, next) {
  const userId = req.auth?.userId;
  if (!userId || !config.adminUserIds.includes(userId)) {
    return res.status(403).json({ message: 'Se requieren permisos de administrador.' });
  }
  next();
}

module.exports = { securityHeaders, createRateLimiter, requireAdmin };
