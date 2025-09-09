const Listing = require("../../core/blocks/Listing");
const ApiUser = require("../models/ApiUser");

class ApiUserListing extends Listing {
    _template = "listing";

    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
        this.model = ApiUser;

        // Define columns with their properties
        this.columns({
            id: {
                column_name: 'id',
                label: 'ID',
                type: 'integer',
                sortable: true,
                filtrable: false
            },
            name: {
                column_name: 'name',
                label: 'Name',
                type: 'string',
                sortable: true,
                filtrable: true
            },
            email: {
                column_name: 'email',
                label: 'Email',
                type: 'string',
                sortable: true,
                filtrable: true
            },
            createdAt: {
                column_name: 'createdAt',
                label: 'Created At',
                type: 'datetime',
                sortable: true,
                filtrable: false
            },
            actions: {
                column_name: 'actions',
                label: 'Actions',
                type: 'string',
                sortable: false,
                filtrable: false
            }
        });

        // Set default sorting
        this.sortColumn('id');
        this.sortDirection('ASC');
    }

    async getData() {
        // Handle query parameters for pagination, sorting, and filtering
        const query = this.req.query;
        
        // Set pagination
        if (query.page) {
            this.page(query.page);
        }
        if (query.per_page) {
            this.perPage(query.per_page);
        }

        // Set sorting
        if (query.sort_column) {
            this.sortColumn(query.sort_column);
        }
        if (query.sort_direction) {
            this.sortDirection(query.sort_direction);
        }

        // Set filters
        const filterMap = {};
        const columns = this.columns();
        
        for (const [queryKey, filterValue] of Object.entries(query)) {
            if (queryKey.startsWith('filter[') && queryKey.endsWith(']')) {
                const dbColumnName = queryKey.slice(7, -1);
                
                if (filterValue && filterValue.trim() !== '') {
                    for (const [columnKey, columnConfig] of Object.entries(columns)) {
                        if (columnConfig.column_name === dbColumnName) {
                            filterMap[columnKey] = filterValue.trim();
                            break;
                        }
                    }
                }
            }
        }
        
        if (Object.keys(filterMap).length > 0) {
            this.filters(filterMap);
        }

        // Prepare the data
        await this.prepareRows();

        return {
            user: this.extra.user || this.req.user,
            model: this,
            ...this.extra
        };
    }

    // Override prepareRows to implement specific data fetching and formatting
    async prepareRows() {
        const where = {};
        const { Op } = require("sequelize");

        // Filters
        for (const key in this._filters) {
            if (this._columns[key] && this._columns[key].filtrable) {
                where[this._columns[key].column_name] = {
                    [Op.like]: `%${this._filters[key]}%`
                };
            }
        }

        // Sorting
        let order = [];
        if (this._sort_column && this._columns[this._sort_column]) {
            order = [[this._columns[this._sort_column].column_name, this._sort_direction]];
        }

        // Count total
        const total = await this.model.count({ where });
        this.totalRecord(total);

        // Pagination
        const offset = (this._page - 1) * this._per_page;

        // Fetch rows
        const rawRows = await this.model.findAll({
            where,
            order,
            limit: this._per_page,
            offset
        });

        // Format rows for display
        if (rawRows) {
            this._rows = rawRows.map(row => {
                return {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    createdAt: new Date(row.createdAt).toLocaleString(),
                    actions: `
                        <button type="button" onclick='editApiUser(${JSON.stringify({id: row.id, name: row.name, email: row.email})})' class="btn btn-sm btn-primary">Edit</button>
                        <button type="button" onclick='deleteApiUser(${row.id})' class="btn btn-sm btn-danger">Delete</button>
                    `
                };
            });
        }

        return this;
    }
}

module.exports = ApiUserListing;
