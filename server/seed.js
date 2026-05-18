const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await connection.query(`
            INSERT IGNORE INTO partners (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `, ['Meet Bathla', 'admin@gmail.com', hashedPassword, 'admin']);
        
        console.log('Seed data added: admin@gmail.com / password123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await connection.end();
    }
}

seed();
