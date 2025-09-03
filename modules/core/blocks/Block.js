const ejs = require("ejs");
const path = require("path");

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

    async block(blockName) {
        if (!blockName) {
            throw new Error("Block name is required");
        }
        return new blockName(this.req, this.res);
    }

    async render() {
        const html = await this.renderToString();
        this.res.send(html);
    }

    async renderToString() {
        const data = await this.getData();
    
        // resolve children first
        const childrenHtml = {};
        for (const [key, child] of Object.entries(this._children)) {
            childrenHtml[key] = await child.renderToString();
        }

        // Get the views directories
        const viewsDirs = this.res.app.get("views");
        let templatePath = this._template + ".ejs";
        
        // Try to find the template in each views directory
        const fs = require('fs');
        let fullTemplatePath = null;
        
        for (const viewsDir of viewsDirs) {
            const candidatePath = path.join(viewsDir, templatePath);
            if (fs.existsSync(candidatePath)) {
                fullTemplatePath = candidatePath;
                break;
            }
        }
        
        if (!fullTemplatePath) {
            throw new Error(`Template not found: ${templatePath} in any of the views directories: ${viewsDirs.join(', ')}`);
        }
    
        return await ejs.renderFile(
            fullTemplatePath,
            {
                me: this,
                children: childrenHtml,
                ...data,
            },
            {
                async: false,
            }
        );
    }
    

    async renderChild(name) {
        const child = this._children[name];
        return child ? await child.renderToString() : "";
    }
}

module.exports = Block;
