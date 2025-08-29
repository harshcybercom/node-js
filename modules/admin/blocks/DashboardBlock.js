const BaseBlock = require("./BaseBlock");

class DashboardBlock extends BaseBlock {
    constructor(req, extra = {}) {
        super(req);
        this.extra = extra;
    }
    
    getTemplate() {
        return "dashboard";
    }

    getData() {
        const user = this.extra.user || this.req.user || null;
        return { user };
    }
}

module.exports = DashboardBlock;
