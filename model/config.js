const mysql = require("mysql")

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database: "chat_application",
    debug : false,
    multipleStatements : true
})

module.exports = connection