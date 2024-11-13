const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.PSQL_USERNAME, // "postgres", // main user of psql
    password: process.env.PSQL_PASSWORD,// "root", // psql password
    host: process.env.PSQL_URL,//"localhost", // location of psql hosted
    port: 5432, // default port
    database: process.env.PSQL_DATABASE// "books" // database name
})


module.exports = pool;