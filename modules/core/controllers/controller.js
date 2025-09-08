const LayoutBlock = require("../blocks/LayoutBlock");

class Controller {
    #_layout = null;
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    layout(_template = null) {
        if (!this.#_layout) {
            this.#_layout = new LayoutBlock(this.req, this.res);
        }
        if (_template) {
            this.#_layout.template(_template);
        }
        return this.#_layout;
    }

    async render() {
        return await this.layout().render();
    }

    block(BlockClass, extra = {}) {
        return new BlockClass(this.req, this.res, extra);
    }

    // model(ModelClass) {
    //     return new ModelClass();
    // }
}

module.exports = Controller;
