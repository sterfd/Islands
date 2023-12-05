const path = require('path');

const knex = require('knex')({
    // client: 'sqlite3',
    // connection: {
    //     filename: path.join(__dirname, 'islands.db')
    // },
    // useNullAsDefault: true

    client: "pg",
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? true : false,

    // connection: {
    //     connectionString: process.env.REACT_APP_DATABASE_URL + '?sslmode=require',
    //     searchPath: ['public'] // Specify the schema you want to use (e.g., 'public')
    // }
    // connection: `${process.env.REACT_APP_DATABASE_URL}?sslmode=require`,
    // connection: {
    // connectionString: process.env.REACT_APP_DATABASE_URL,
    // ssl: { rejectUnauthorized: false },
    // },
    // debug: true,

});

module.exports = knex;