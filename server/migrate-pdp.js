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
        console.log('Running PDP migration...');

        const columns = [
            'product_banner VARCHAR(255) AFTER logo_url',
            'stats JSON AFTER is_active',
            'benefits JSON AFTER stats',
            'whom_to_refer JSON AFTER benefits',
            'training_videos JSON AFTER whom_to_refer',
            'how_to_perform_steps JSON AFTER training_videos',
            'terms_conditions JSON AFTER how_to_perform_steps',
            'faqs JSON AFTER terms_conditions',
            'marketing_materials JSON AFTER faqs'
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE products ADD COLUMN ${col}`);
                console.log(`Added column: ${col.split(' ')[0]}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists: ${col.split(' ')[0]}`);
                } else {
                    console.error(`Error adding column ${col}:`, err.message);
                }
            }
        }
        console.log('PDP Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
