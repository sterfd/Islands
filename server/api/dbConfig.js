const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './islands.db'
    },
    useNullAsDefault: true
});

module.exports = knex;