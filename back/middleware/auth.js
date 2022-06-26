const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'test_token');
    const userId = decodedToken.userId;
    req.auth = {userId : userId}
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'; // throw renvoie l'erreur
    } else {
      next();
    }
  } catch {
    res.status(401).json({ // 401 = pb d'authentification
      error: new Error('Invalid request!')
    });
  }
};