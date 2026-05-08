import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // Get token from header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Not authorized to access this route',
      message: 'No token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Not authorized to access this route',
      message: error.message
    });
  }
};

export default protect;
