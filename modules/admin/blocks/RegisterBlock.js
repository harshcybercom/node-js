const BaseBlock = require("./BaseBlock");

class RegisterBlock extends BaseBlock {
    constructor(req, extra = {}) {
        super(req);
        this.extra = extra;
    }

    getTemplate() {
        return "register";
    }

    getData() {
        return { error: this.extra.error || null };
    }
}

module.exports = RegisterBlock;
