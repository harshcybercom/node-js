const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const ApiToken = require('../models/ApiToken');
const LoginBlock = require("../blocks/LoginBlock");
const RegisterBlock = require("../blocks/RegisterBlock");
const DashboardBlock = require("../blocks/DashboardBlock");

class AdminController {
    async index(req, res) {
        res.json({ message: "Welcome to Admin Index" });
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

    async showRegister(req, res) {
        const block = new RegisterBlock(req);
        res.render(block.getTemplate(), block.getData());
    }

    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                const block = new RegisterBlock(req, { error: "All fields are required" });
                return res.render(block.getTemplate(), block.getData());
            }

            const existing = await User.findOne({ where: { email } });
            if (existing) {
                const block = new RegisterBlock(req, { error: "Email already registered" });
                return res.render(block.getTemplate(), block.getData());
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password_hash: hashedPassword
            });

            // generate token
            const token = crypto.randomBytes(32).toString('hex');
            await ApiToken.create({
                user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000)
            });

            req.session.token = token;
            res.redirect('/admin/admin/dashboard');
        } catch (err) {
            const block = new RegisterBlock(req, { error: err.message });
            res.render(block.getTemplate(), block.getData());
        }
    }

    async showLogin(req, res) {
        const block = new LoginBlock(req);
        res.render(block.getTemplate(), block.getData());
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const block = new LoginBlock(req, { error: "Email and password are required" });
                return res.render(block.getTemplate(), block.getData());
            }
    
            const user = await User.findOne({ where: { email } });
            if (!user) {
                const block = new LoginBlock(req, { error: "User not found" });
                return res.render(block.getTemplate(), block.getData());
            }
    
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                const block = new LoginBlock(req, { error: "Invalid credentials" });
                return res.render(block.getTemplate(), block.getData());
            }
    
            // ✅ on success create token + session
            const token = crypto.randomBytes(32).toString("hex");
            await ApiToken.create({
                user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000)
            });
    
            req.session.token = token;
    
            res.redirect("/admin/admin/dashboard");
        } catch (err) {
            const block = new LoginBlock(req, { error: err.message });
            res.render(block.getTemplate(), block.getData());
        }
    }

    async dashboard(req, res) {
        if (!req.user) {
            return res.redirect("/admin/admin/login");
        }
    
        const block = new DashboardBlock(req, { user: req.user });
        res.render(block.getTemplate(), block.getData());
    }

    async logout(req, res) {
        try {
            if (req.session && req.session.token) {
                const token = req.session.token;
    
                // revoke in DB
                await ApiToken.update(
                    { revoked: true },
                    { where: { token } }
                );
    
                // destroy session
                req.session.destroy(err => {
                    if (err) {
                        return res.status(500).json({ error: "Logout failed" });
                    }
                    res.redirect('/admin/admin/login');
                });
            } else {
                res.redirect('/admin/admin/login');
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update user
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, is_active } = req.body;

            await User.update({ name, email, is_active }, { where: { id } });

            res.json({ message: "User updated successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete user
    async delete(req, res) {
        try {
            const { id } = req.params;
            await User.destroy({ where: { id } });
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AdminController();
