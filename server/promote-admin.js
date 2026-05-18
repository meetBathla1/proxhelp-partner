const mysql = require('mysql2/promise');
require('dotenv').config();

async function promoteAdmin() {
    const email = process.argv[2];
    if (!email) {
        console.log('Usage: node promote-admin.js <email>');
        process.exit(1);
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const [result] = await connection.query(
            'UPDATE partners SET role = "admin" WHERE email = ?',
            [email]
        );

        if (result.affectedRows > 0) {
            console.log(`Success! User ${email} is now an ADMIN.`);
        } else {
            console.log(`Error: User with email ${email} not found.`);
        }
    } catch (error) {
        console.error('Error promoting admin:', error);
    } finally {
        await connection.end();
    }
}

promoteAdmin();
