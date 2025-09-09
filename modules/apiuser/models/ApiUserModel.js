const BaseModel = require('../../core/models/BaseModel');
const ApiUser = require('./ApiUser');

class ApiUserModel extends BaseModel {
    constructor() {
        super(ApiUser);

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

    // Override prepareRows to format data for display
    async prepareRows() {
        await super.prepareRows();

        if (this._rows) {
            this._rows = this._rows.map(row => {
                const formattedRow = {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    createdAt: new Date(row.createdAt).toLocaleString(),
                    actions: `
                        <button type="button" onclick='editApiUser(${JSON.stringify({id: row.id, name: row.name, email: row.email})})' class="btn btn-sm btn-primary">Edit</button>
                        <button type="button" onclick='deleteApiUser(${row.id})' class="btn btn-sm btn-danger">Delete</button>
                    `
                };
                return formattedRow;
            });
        }

        return this;
    }
}

module.exports = ApiUserModel;
