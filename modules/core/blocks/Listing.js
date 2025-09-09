// modules/core/blocks/Listing.js
const Block = require("./Block");

class Listing extends Block {
  constructor(req, res) {
    super(req, res);
    this._template = 'listing.ejs';

    // Data
    this._rows = null;
    this._columns = {};
    this._filters = {};

    // Column defaults
    this._column_defaults = {
      column_name: "",
      sortable: false,
      filtrable: false,
      label: "",
      type: "string"
    };

    // Pagination
    this._page = 1;
    this._per_page = 10;
    this._total_record = 0;
    this._total_page = 0;
    this._per_page_options = [10, 20, 30, 50, 100];

    // Sorting
    this._sort_column = null;
    this._sort_direction = "ASC";
  }

  // -------- Columns --------
  columns(key, value, reset = false) {
    if (key === undefined) return this._columns;
    if (reset === true) { this._columns = {}; return this; }

    if (typeof key === "object") {
      for (const colKey in key) this._addColumn(colKey, key[colKey]);
      return this;
    }
    if (value === null) { delete this._columns[key]; return this; }

    this._addColumn(key, value);
    return this;
  }

  _addColumn(key, value) {
    this._columns[key] = { ...this._column_defaults, ...value };
    const col = this._columns[key];
    if (!col.column_name || !col.label || !col.type) {
      throw new Error("column_name, label, and type are mandatory");
    }
  }

  // -------- Filters --------
  filters(key, value, reset = false) {
    if (key === undefined) return this._filters;
    if (reset === true) { this._filters = {}; return this; }
    if (typeof key === "object") { this._filters = { ...this._filters, ...key }; return this; }

    if (value === null) delete this._filters[key];
    else this._filters[key] = value;
    return this;
  }

  // -------- Pagination --------
  page(value) {
    if (value === undefined) return this._page;
    this._page = parseInt(value, 10) || 1;
    return this;
  }

  perPage(value) {
    if (value === undefined) return this._per_page;
    if (!this._per_page_options.includes(parseInt(value, 10))) throw new Error("Invalid perPage");
    this._per_page = parseInt(value, 10);
    return this;
  }

  perPageOptions(value) {
    if (value === undefined) return this._per_page_options;
    this._per_page_options = value;
    return this;
  }

  totalRecord(value) {
    if (value === undefined) return this._total_record;
    this._total_record = parseInt(value, 10) || 0;
    this._total_page = Math.ceil(this._total_record / this._per_page);
    return this;
  }

  totalPage() { return this._total_page; }

  // -------- Sorting --------
  sortColumn(value) { if (value !== undefined) this._sort_column = value; return this._sort_column; }
  sortDirection(value) { if (value !== undefined) this._sort_direction = value.toUpperCase(); return this._sort_direction; }

  // -------- Rows --------
  async prepareRows() {
    // This method should be overridden by child classes
    // to implement specific data fetching logic
    return this;
  }

  rows() { return this._rows; }
}

module.exports = Listing;
