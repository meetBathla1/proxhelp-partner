const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateBalance() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '#Meet1010',
        database: process.env.DB_NAME || 'finxpert_partner'
    });

    try {
        const [partners] = await db.query('SELECT id FROM partners LIMIT 1');
        if (partners.length > 0) {
            const pid = partners[0].id;
            await db.query('INSERT INTO wallet_transactions (partner_id, amount, type, status, description) VALUES (?, 10000.00, "earning", "completed", "Manual Balance Update")', [pid]);
            console.log('Successfully added 10,000 to the partner balance.');
        } else {
            console.log('No partners found.');
        }
    } catch (err) {
        console.error('Error updating balance:', err);
    } finally {
        await db.end();
    }
}

updateBalance();
