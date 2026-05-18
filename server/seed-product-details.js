const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const c = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Seeding product details...');

    // Sample features for Credit Cards
    const ccFeatures = JSON.stringify([
      { icon: '✈️', text: 'Complimentary airport lounge access' },
      { icon: '🎁', text: 'Exciting rewards & cashback benefits' },
      { icon: '⛽', text: 'Fuel surcharge waiver' }
    ]);

    // Sample features for Personal Loans
    const plFeatures = JSON.stringify([
      { icon: '🌐', text: 'Digital approval' },
      { icon: '⚡', text: 'Fast disbursal' },
      { icon: '💡', text: 'No collateral required' }
    ]);

    // Update all credit cards (assuming service_id 1 is Credit Card)
    await c.query(`UPDATE products SET features = ?, joining_fee = 'Up to 500', renewal_fee = '499' WHERE service_id = (SELECT id FROM services WHERE name = 'Credit Card')`, [ccFeatures]);

    // Update all personal loans (assuming service_id 2 is Personal Loan)
    await c.query(`UPDATE products SET features = ?, joining_fee = 'Up to 2%', renewal_fee = '0' WHERE service_id = (SELECT id FROM services WHERE name = 'Personal Loan')`, [plFeatures]);

    // Update everything else with generic features
    const genericFeatures = JSON.stringify([
      { icon: '⭐', text: 'Premium service experience' },
      { icon: '🔒', text: '100% secure processing' },
      { icon: '💸', text: 'Zero hidden charges' }
    ]);
    await c.query(`UPDATE products SET features = ?, joining_fee = 'Free', renewal_fee = '0' WHERE features IS NULL OR features = '[]'`, [genericFeatures]);

    console.log('✅ Database seeded successfully with dummy details.');
    await c.end();
  } catch (err) {
    console.error('Seeding failed:', err);
  }
})();
