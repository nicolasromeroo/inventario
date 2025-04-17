
// middlewares/isAuthenticated.middleware.js
import jwt from 'jsonwebtoken';
import envsConfig from '../config/envs.config.js';

const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No hay token disponible. Usuario no autenticado.' });
    }

    jwt.verify(token, envsConfig.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido.' });
        }
        req.user = decoded;
        next();
    });
};

export default isAuthenticated;
