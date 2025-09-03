const jwt = require('jsonwebtoken');
const ApiUserToken = require('../modules/apiuser/models/ApiUserToken');
const ApiUser = require('../modules/apiuser/models/ApiUser');

async function apiUserAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Authorization token required" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        const apiToken = await ApiUserToken.findOne({
            where: { token, revoked: false },
            include: [{ model: ApiUser }]
        });

        if (!apiToken || !apiToken.ApiUser) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        req.user = apiToken.ApiUser;
        next();
    } catch (err) {
        res.status(401).json({ error: "Auth failed: " + err.message });
    }
}

module.exports = apiUserAuth;
