const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Nenhum token fornecido.' });

    const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Falha ao autenticar token.' });
        req.userId = decoded.id;
        next();
    });
};
