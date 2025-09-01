const Block = require("./Block");

class LoginBlock extends Block {
    _template = "login";

    getData() {
        return { error: this.req.query.error || null };
    }
}

module.exports = LoginBlock;
