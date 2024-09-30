import { verifyJWT } from "../utils/tokenUtils.js";

export const authMiddleware = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        res.status(401).json({message: 'Unauthenticated token not found'});
    }
    try {
        const {userId} = verifyJWT(token);
        req.user = userId;
        next();
    } catch (error) {
        res.status(401).json({message: 'Unauthenticated'});
    }
}