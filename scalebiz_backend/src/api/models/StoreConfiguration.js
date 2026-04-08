const database = require('../../config/database');

class StoreConfiguration {
    constructor() {
        this.table = 'store_configurations';
    }

    async findOne(query) {
        const [rows] = await database.query(`SELECT * FROM ${this.table} WHERE ? LIMIT 1`, [query]);
        return rows[0];
    }

    // Add other necessary methods like create, update if needed in the future
}

module.exports = new StoreConfiguration();