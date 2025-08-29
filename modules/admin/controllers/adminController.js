const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const ApiToken = require('../models/ApiToken');

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
        res.render('admin/register', { error: null });
    }

    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.render('admin/register', { error: "All fields are required" });
            }

            const existing = await User.findOne({ where: { email } });
            if (existing) {
                return res.render('admin/register', { error: "Email already registered" });
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
            res.render('admin/register', { error: err.message });
        }
    }

    async showLogin(req, res) {
        res.render('admin/login', { error: null });
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.render('admin/login', { error: "Email and password are required" });
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.render('admin/login', { error: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.render('admin/login', { error: "Invalid credentials" });
            }

            // generate token
            const token = crypto.randomBytes(32).toString('hex');
            await ApiToken.create({
                user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000)
            });

            // store token in session
            req.session = req.session || {}; // fallback if express-session not set yet
            req.session.token = token;

            res.redirect('/admin/admin/dashboard');
        } catch (err) {
            res.render('admin/login', { error: err.message });
        }
    }

    async dashboard(req, res) {
        try {
            if (!req.user) {
                return res.redirect('/admin/admin/login');
            }
            res.render('admin/dashboard', { user: req.user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
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
}

module.exports = new AdminController();
