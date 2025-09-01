const Block = require("./Block");
const User = require("../models/User");

class DashboardBlock extends Block {
    _template = "dashboard";
    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
    }
    
    async getData() {
        const user = this.extra.user || this.req.user || null;
        const users = await this._getUsers();
        return { user, users };
    }

    async _getUsers() {
        // Example: using Sequelize
        return await User.findAll({ raw: true });
    }
}

module.exports = DashboardBlock;
