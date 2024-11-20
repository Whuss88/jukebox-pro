const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: decoded.id } });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

module.exports = auth;
