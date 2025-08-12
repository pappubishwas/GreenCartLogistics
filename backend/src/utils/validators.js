const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token error' });
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Token malformatted' });

  jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalid' });
    req.user = { email: decoded.email };
    next();
  });
}

module.exports = { authMiddleware };
