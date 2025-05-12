const { getAuth, requireAuth } = require('@clerk/express');

const clerkAuthMiddleware = requireAuth({
  unauthorizedHandler: (req, res) => {
    res.status(401).json({ error: 'No autorizado' });
  },
});

function redirectIfUnauthenticated(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.redirect(`https://deep-pipefish-84.accounts.dev/sign-in`);
    }

    next();
  } catch (error) {
    console.error('Clerk error:', error.message);
    res.status(401).send('Not authenticated');
  }
}

module.exports = { clerkAuthMiddleware, redirectIfUnauthenticated };
