class Block {
    _template = 'block.ejs';
    _children = {};
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    
    template(template = null) {
        if (template) {
            this._template = template;
            return this;
        }
        return this._template;
    }

    children(children = {}, reset = false) {
        if (reset) {
            this._children = {};
            return this;
        }
        if (children) {
            if (typeof children !== "object") {
                return this;
            }
            for (const [key, block] of Object.entries(children)) {
                this.child(key, block);
            }
            return this;
        }
        return this._children;
    }

    child(key, block = null, reset = false) {
        if (reset) {
            if (this._children[key]) {
                delete this._children[key];
            }
            return this;
        }
        if (block instanceof Block) {
            this._children[key] = block;
            return this;
        }
        if (this._children[key]) {
            return this._children[key];
        }
        return null;
    }

    async getData() {
        return {}; // subclasses override this
    }

    printHello() {
        return 'Ccc';
    }

    async render() {
        const data = await this.getData();
        this.res.render(this._template, {
            me: this,
            ...data,
        });
    }
}

module.exports = Block;
