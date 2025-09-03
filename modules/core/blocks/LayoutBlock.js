const Block = require("./Block");
const HeaderBlock = require("./html/HeaderBlock");
const ContentBlock = require("./html/ContentBlock");
const FooterBlock = require("./html/FooterBlock");

class LayoutBlock extends Block {
    _template = "layout"; // ejs file path under views/layout/

    constructor(req, res) {
        super(req, res);

        // Attach child blocks
        this.child("header", new HeaderBlock(req, res));
        this.child("content", new ContentBlock(req, res));
        this.child("footer", new FooterBlock(req, res));

        this.styles = [];
        this.scripts = [];
        this.title = "Admin Panel";
    }

    addStyle(file) {
        this.styles.push(file);
    }

    addScript(file) {
        this.scripts.push(file);
    }

    setTitle(title) {
        this.title = title;
    }

    async getData() {
        return {
            styles: this.styles,
            scripts: this.scripts,
            title: this.title,
        };
    }
}

module.exports = LayoutBlock;
