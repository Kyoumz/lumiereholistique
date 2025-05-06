const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

function authenticateToken(req, res, next) {
  // console.log('test')
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
