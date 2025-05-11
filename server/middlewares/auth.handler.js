const { requireAuth } = require('@clerk/express');

const clerkAuthMiddleware = requireAuth({
  unauthorizedHandler: (req, res) => {
    res.status(401).json({ error: 'No autorizado' });
  },
});

module.exports = clerkAuthMiddleware;
