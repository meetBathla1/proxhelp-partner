const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding share_image_url and share_description to products table...');
        
        try {
            await connection.query('ALTER TABLE products ADD COLUMN share_image_url VARCHAR(255) AFTER renewal_fee');
            console.log('Added share_image_url');
        } catch (e) {
            console.log('share_image_url might already exist');
        }

        try {
            await connection.query('ALTER TABLE products ADD COLUMN share_description TEXT AFTER share_image_url');
            console.log('Added share_description');
        } catch (e) {
            console.log('share_description might already exist');
        }

        console.log('Database migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
