const Block = require("../../core/blocks/LayoutBlock");

class DashboardBlock extends Block {
    _template = "dashboard";

    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
        this.addScript("/js/apiuser-dashboard.js");
        this.setTitle("API User Dashboard");
    }

    async getData() {
        return {
            user: this.extra.user || this.req.user,
            ...this.extra
        };
    }
}

module.exports = DashboardBlock;
