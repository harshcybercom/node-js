const Block = require("../../core/blocks/LayoutBlock");

class RegisterBlock extends Block {
    _template = "register";

    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
        this.setTitle("API User Register");
    }

    async getData() {
        return { error: this.extra.error || null };
    }
}

module.exports = RegisterBlock;
