import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
    }

    const secretOrPublicKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretOrPublicKey);

    // Retrieve user from MongoDB using the decoded token payload
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found',
      });
    }

    // Attach user object to request object for use in subsequent middleware or routes
    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Token expired',
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
