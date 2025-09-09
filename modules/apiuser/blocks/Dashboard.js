const Block = require("../../core/blocks/LayoutBlock");
const ApiUserModel = require("../models/ApiUserModel");

class DashboardBlock extends Block {
    _template = "dashboard";

    constructor(req, res, extra = {}) {
        super(req, res);
        this.extra = extra;
        this.addScript("/js/apiuser-dashboard.js");
        this.addStyle("/css/table.css");
        this.setTitle("API User Dashboard");
    }

    async getData() {
        // Initialize the ApiUserModel
        const apiUserModel = new ApiUserModel();
        
        // Handle query parameters for pagination, sorting, and filtering
        const query = this.req.query;
        // Set pagination
        if (query.page) {
            apiUserModel.page(query.page);
        }
        if (query.per_page) {
            apiUserModel.perPage(query.per_page);
        }

        // Set sorting
        if (query.sort_column) {
            apiUserModel.sortColumn(query.sort_column);
        }
        if (query.sort_direction) {
            apiUserModel.sortDirection(query.sort_direction);
        }

        // Set filters
        // Look for filter parameters in the format filter[column_name]
        const filterMap = {};
        const columns = apiUserModel.columns();
        
        for (const [queryKey, filterValue] of Object.entries(query)) {
            // Check if this is a filter parameter (starts with "filter[" and ends with "]")
            if (queryKey.startsWith('filter[') && queryKey.endsWith(']')) {
                const dbColumnName = queryKey.slice(7, -1); // Extract column name from filter[column_name]
                
                if (filterValue && filterValue.trim() !== '') {
                    // Find the model column key that has this database column name
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
            apiUserModel.filters(filterMap);
        }

        // Prepare the data
        await apiUserModel.prepareRows();

        return {
            user: this.extra.user || this.req.user,
            model: apiUserModel,
            ...this.extra
        };
    }
}

module.exports = DashboardBlock;
