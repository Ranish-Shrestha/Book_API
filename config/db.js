const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres", // main user of psql
    password: "root", // psql password
    host: "localhost", // location of psql hosted
    port: 5432, // default port
    database: "booksecondbind" // database name
})


module.exports = pool;