class BaseBlock {
    constructor(req) {
        this.req = req;
    }

    getTemplate() {
        throw new Error("getTemplate() must be implemented");
    }

    getData() {
        return {};
    }
}

module.exports = BaseBlock;
