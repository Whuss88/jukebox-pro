const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = require("../prisma");

const auth = async (req, res, next) => {
  const token = req.header(`Authorization`).replace(`Bearer `, ``);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if(!user) {
      throw new Error();
    } 
    req.user = user ;
    next();
  } catch(e) {
    res.status(401).send({ error: `Please Authenticate.`});
  }
} 

module.exports = auth;