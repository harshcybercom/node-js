const Block = require("../../core/blocks/LayoutBlock");

class LoginBlock extends Block {
    _template = "login";

    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
        this.setTitle("API User Login");
    }

    async getData() {
        return { error: this.extra.error || null };
    }
}

module.exports = LoginBlock;
