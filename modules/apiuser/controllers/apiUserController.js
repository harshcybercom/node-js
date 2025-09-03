const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ApiUser = require("../models/ApiUser");
const ApiUserToken = require("../models/ApiUserToken");
const LoginBlock = require("../blocks/Login");
const RegisterBlock = require("../blocks/Register");
const DashboardBlock = require("../blocks/Dashboard");
const LayoutBlock = require("../../core/blocks/LayoutBlock");

class ApiUserController {
    // API Index
    async index(req, res) {
        res.json({ message: "Welcome to API User Index" });
    }

    // Create new API user (CRUD - Create)
    async create(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: "Name, email, and password are required" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new API user
            const user = await ApiUser.create({
                name,
                email,
                password: hashedPassword
            });

            const token = crypto.randomBytes(32).toString('hex');

            // Save token for this user
            await ApiUserToken.create({
                api_user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000) // 7 days expiry
            });

            res.json({
                message: "API User created successfully",
                userId: user.id,
                token
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // List all API users (CRUD - Read)
    async list(req, res) {
        try {
            const users = await ApiUser.findAll({
                include: [{ model: ApiUserToken }],
                attributes: { exclude: ['password'] } // Don't return passwords
            });
            res.json({ users });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update API user (CRUD - Update)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;

            const user = await ApiUser.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            await ApiUser.update({ name, email }, { where: { id } });

            res.json({ message: "API User updated successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete API user (CRUD - Delete)
    async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await ApiUser.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            await ApiUser.destroy({ where: { id } });
            res.json({ message: "API User deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // GET /apiuser/login (form)
    static async showLogin(req, res) {
        const layout = new LayoutBlock(req, res);
        const content = layout.child("content");

        const loginBlock = new LoginBlock(req, res);
        content.child("login", loginBlock);

        layout.setTitle("Login - API User");

        await layout.render();
    }

    // POST /apiuser/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                const layout = new LayoutBlock(req, res);
                const content = layout.child("content");
                const loginBlock = new LoginBlock(req, res, { error: "Email and password are required" });
                content.child("login", loginBlock);
                layout.setTitle("Login - API User");
                return await layout.render();
            }

            const user = await ApiUser.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                const layout = new LayoutBlock(req, res);
                const content = layout.child("content");
                const loginBlock = new LoginBlock(req, res, { error: "Invalid credentials" });
                content.child("login", loginBlock);
                layout.setTitle("Login - API User");
                return await layout.render();
            }

            // Create token and save session
            const token = crypto.randomBytes(32).toString('hex');
            await ApiUserToken.create({
                api_user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000)
            });

            req.session.apiUserId = user.id;
            req.session.token = token;
            return res.redirect("/apiuser/dashboard");
        } catch (err) {
            const layout = new LayoutBlock(req, res);
            const content = layout.child("content");
            const loginBlock = new LoginBlock(req, res, { error: err.message });
            content.child("login", loginBlock);
            layout.setTitle("Login - API User");
            return await layout.render();
        }
    }

    // GET /apiuser/register (form)
    static async showRegister(req, res) {
        const layout = new LayoutBlock(req, res);
        const content = layout.child("content");

        const registerBlock = new RegisterBlock(req, res);
        content.child("register", registerBlock);

        layout.setTitle("Register - API User");

        await layout.render();
    }

    // POST /apiuser/register
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                const layout = new LayoutBlock(req, res);
                const content = layout.child("content");
                const registerBlock = new RegisterBlock(req, res, { error: "All fields are required" });
                content.child("register", registerBlock);
                layout.setTitle("Register - API User");
                return await layout.render();
            }

            const existing = await ApiUser.findOne({ where: { email } });
            if (existing) {
                const layout = new LayoutBlock(req, res);
                const content = layout.child("content");
                const registerBlock = new RegisterBlock(req, res, { error: "Email already registered" });
                content.child("register", registerBlock);
                layout.setTitle("Register - API User");
                return await layout.render();
            }

            const hash = await bcrypt.hash(password, 10);

            const user = await ApiUser.create({
                name,
                email,
                password: hash
            });

            // Generate token
            const token = crypto.randomBytes(32).toString('hex');
            await ApiUserToken.create({
                api_user_id: user.id,
                token,
                expires_at: new Date(Date.now() + 7*24*60*60*1000)
            });

            req.session.apiUserId = user.id;
            req.session.token = token;
            return res.redirect("/apiuser/dashboard");
        } catch (err) {
            const layout = new LayoutBlock(req, res);
            const content = layout.child("content");
            const registerBlock = new RegisterBlock(req, res, { error: err.message });
            content.child("register", registerBlock);
            layout.setTitle("Register - API User");
            return await layout.render();
        }
    }

    // GET /apiuser/dashboard
    static async dashboard(req, res) {
        if (!req.session.apiUserId) {
            return res.redirect("/apiuser/login");
        }

        try {
            const user = await ApiUser.findByPk(req.session.apiUserId, {
                attributes: { exclude: ['password'] }
            });

            const layout = new LayoutBlock(req, res);
            const content = layout.child("content");

            const dashboardBlock = new DashboardBlock(req, res, { user });
            content.child("dashboard", dashboardBlock);

            layout.setTitle("Dashboard - API User");
            layout.addScript("/js/apiuser-dashboard.js");

            await layout.render();
        } catch (err) {
            res.redirect("/apiuser/login");
        }
    }

    // GET /apiuser/logout
    static async logout(req, res) {
        try {
            if (req.session && req.session.token) {
                const token = req.session.token;

                // Revoke token in DB
                await ApiUserToken.update(
                    { revoked: true },
                    { where: { token } }
                );

                // Destroy session
                req.session.destroy(err => {
                    if (err) {
                        return res.status(500).json({ error: "Logout failed" });
                    }
                    res.redirect('/apiuser/login');
                });
            } else {
                res.redirect('/apiuser/login');
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ApiUserController;
