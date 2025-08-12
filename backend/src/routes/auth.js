const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const MANAGER = {
  email: process.env.MANAGER_EMAIL,
  passwordHash: null
};


(async () => {
  const pw = process.env.MANAGER_PASSWORD;
  MANAGER.passwordHash = await bcrypt.hash(pw, 10);
})();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  if (email !== MANAGER.email) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, MANAGER.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.json({ token });
});

module.exports = router;
