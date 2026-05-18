const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Seeding sharing data for existing products...');
        
        const products = [
            {
                name: 'Swiggy HDFC Bank Card',
                share_image: 'https://images.unsplash.com/photo-1556742560-60a058246e85?auto=format&fit=crop&q=80&w=800',
                share_desc: 'Get 10% Cashback on Swiggy and 5% on online shopping! Enjoy a Lifetime Free card with premium benefits.'
            },
            {
                name: 'AU Bank Altura Plus',
                share_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
                share_desc: 'Earn 1.5% Reward Points and get Buy 1 Get 1 Movie Tickets! Perfect card for lifestyle and travel.'
            },
            {
                name: 'IndusInd Bank Personal Loan',
                share_image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800',
                share_desc: 'Quick digital approval and fast disbursal! Get the funds you need at attractive interest rates.'
            },
            {
                name: 'Kotak 811 Savings Account',
                share_image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=800',
                share_desc: 'Open a Zero Balance Savings Account instantly! Earn up to 4% interest and enjoy digital banking.'
            }
        ];

        for (const p of products) {
            await connection.query(
                'UPDATE products SET share_image_url = ?, share_description = ? WHERE name = ?',
                [p.share_image, p.share_desc, p.name]
            );
            console.log(`Updated ${p.name}`);
        }

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await connection.end();
    }
}

seed();
