const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Check connection
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database does not exist. Please create it manually or check your config.');
        } else {
            console.error('Error connecting to MySQL:', err.message);
        }
    } else {
        console.log('Successfully connected to MySQL database.');
        connection.release();
    }
});

module.exports = promisePool;
