const mysql = require('mysql');

//connecting to db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password', //ALTER USER root IDENTIFIED WITH mysql_native_password BY 'password';
    database: 'userdb'
});

connection.connect(error => {
    if (error) throw error;
    else console.log('DB Connected...');
});
module.exports = connection;