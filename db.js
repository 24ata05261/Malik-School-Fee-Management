// MySQL Database Connection
// Developed By: PINJARI ABDUL MALIK

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "school_fee"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed!");
        console.log(err);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

module.exports = db;