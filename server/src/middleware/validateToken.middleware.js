
// validateToken.middleware.js
import jwt from "jsonwebtoken";
import envsConfig from "../config/envs.config.js";

export const authRequired = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, autorización denegada." });
    }

    jwt.verify(token, envsConfig.JWT_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido." });
        }
        req.user = user;
        next();  
    });
};
