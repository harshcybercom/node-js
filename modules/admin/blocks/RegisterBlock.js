const Block = require("../../core/blocks/Block");

class RegisterBlock extends Block {
    _template = "register";
    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
    }

    getData() {
        return { error: this.extra.error || null };
    }
}

module.exports = RegisterBlock;
