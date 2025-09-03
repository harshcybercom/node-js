const LayoutBlock = require("../blocks/LayoutBlock");

class CoreController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this._layout = null;
    }

    async renderWithLayout(req, res, BlockClass, title, childName = "content", extra = {}) {
        const layout = new LayoutBlock(req, res);
        const content = layout.child(childName);

        const block = new BlockClass(req, res, extra);
        content.child(block._template || BlockClass.name.toLowerCase(), block);

        layout.setTitle(title);
        await layout.render();
    }

    layout() {
        if (!this._layout) {
            this._layout = new LayoutBlock(this.req, this.res);
        }
        return this._layout;
    }

    async render() {
        return await this.layout().render();
    }

    block(BlockClass, extra = {}) {
        return new BlockClass(this.req, this.res, extra);
    }

    model(ModelClass) {
        return new ModelClass();
    }
}

module.exports = CoreController;
