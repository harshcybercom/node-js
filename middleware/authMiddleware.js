const ApiToken = require('../modules/admin/models/ApiToken');
const User = require('../modules/admin/models/User');

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Authorization token required" });
        }

        const token = authHeader.split(' ')[1];

        // Find token in DB
        const apiToken = await ApiToken.findOne({
            where: { token, revoked: false },
            include: [{ model: User }]
        });

        if (!apiToken) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Check expiry
        if (apiToken.expires_at && new Date(apiToken.expires_at) < new Date()) {
            return res.status(401).json({ error: "Token expired" });
        }

        // Attach user info to request
        req.user = apiToken.User;

        next();
    } catch (err) {
        res.status(500).json({ error: "Auth error: " + err.message });
    }
}

module.exports = authMiddleware;
