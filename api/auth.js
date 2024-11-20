const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = require("../prisma");
const express = require("express");
const router = express.Router();

router.use(express.json());

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

// Middleware to check and set authenticated user
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUniqueOrThrow({ where: { id } });
      req.user = user;
    } catch (e) {
      return res.status(401).send({ message: 'Invalid token' });
    }
  }
  next();
});

// Register a new user
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.register(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    if (e.code === 'P2002') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      next(e);
    }
  }
});

// Log in a user
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.login(username, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

// Middleware to ensure the user is authenticated
function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ status: 401, message: 'You must be logged in.' });
  }
}

module.exports = {
  router,
  authenticate,
};
