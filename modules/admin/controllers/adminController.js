const User = require('../models/User');
const ApiToken = require('../models/ApiToken');

class AdminController {
    async index(req, res) {
        res.json({ message: "Welcome to Admin Index" });
    }

    async dashboard(req, res) {
        res.json({ message: "Admin dashboard page" });
    }

    async create(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: "Name, email, and password are required" });
            }

            // Create new user
            const user = await User.create({
                name,
                email,
                password_hash: password // ⚠️ should hash before storing
            });

            const token = Math.random().toString(36).substring(2);

            // Save token for this user
            await ApiToken.create({
                user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000) // 7 days expiry
            });

            res.json({
                message: "User created successfully",
                userId: user.id,
                token
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async list(req, res) {
        try {
            const users = await User.findAll({
                include: [{ model: ApiToken }]
            });
            res.json({ users });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (user.password_hash !== password) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = Math.random().toString(36).substring(2);

            await ApiToken.create({
                user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000)
            });

            res.json({
                message: "Login successful",
                token,
                userId: user.id
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AdminController();
