import { verifyJWT } from "../utils/tokenUtils.js";

export const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated: Token not found' });
  }

  try {
    const { userId } = verifyJWT(token);
    req.user = userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthenticated: Invalid or expired token' });
  }
};
