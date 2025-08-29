const BaseBlock = require("./BaseBlock");

class LoginBlock extends BaseBlock {
    getTemplate() {
        return "login"; // views/admin/login.ejs
    }

    getData() {
        return { error: this.req.query.error || null };
    }
}

module.exports = LoginBlock;
