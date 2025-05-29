require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10 // Allows multiple queries
});

// Check connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to database');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

async function query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results;
}

module.exports = { query };