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
    console.log('Starting migration...');

    // 1. Create offline_partners table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS offline_partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bank_name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(500),
        features JSON,
        apply_url VARCHAR(500),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created offline_partners table.');

    // 2. Seed initial offline partners
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM offline_partners');
    if (existing[0].count === 0) {
      const demoPartners = [
        {
          bank_name: 'HDFC Bank',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg',
          features: JSON.stringify(['Documents Upload', 'Dedicated Support']),
          apply_url: 'https://www.hdfcbank.com/',
          status: 'active'
        },
        {
          bank_name: 'ICICI Bank',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/ICICI_Bank_Logo.svg',
          features: JSON.stringify(['Documents Upload', 'Dedicated Support']),
          apply_url: 'https://www.icicibank.com/',
          status: 'active'
        },
        {
          bank_name: 'YES Bank',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Yes_Bank_SVG_Logo.svg',
          features: JSON.stringify(['Documents Upload', 'Dedicated Support']),
          apply_url: 'https://www.yesbank.in/',
          status: 'active'
        },
        {
          bank_name: 'IDFC FIRST Bank',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/IDFC_First_Bank_logo.svg',
          features: JSON.stringify(['Documents Upload', 'Dedicated Support']),
          apply_url: 'https://www.idfcfirstbank.com/',
          status: 'active'
        },
        {
          bank_name: 'SBI Bank',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/State_Bank_of_India_logo.svg',
          features: JSON.stringify(['Documents Upload', 'Dedicated Support']),
          apply_url: 'https://www.sbi.co.in/',
          status: 'active'
        }
      ];

      for (const partner of demoPartners) {
        await connection.query(
          'INSERT INTO offline_partners (bank_name, logo_url, features, apply_url, status) VALUES (?, ?, ?, ?, ?)',
          [partner.bank_name, partner.logo_url, partner.features, partner.apply_url, partner.status]
        );
      }
      console.log('Seeded initial offline partners.');
    } else {
      console.log('Offline partners already seeded.');
    }

    // 3. Add to services table for Quick Actions if not exists
    const [existingService] = await connection.query('SELECT * FROM services WHERE name = ?', ['Offline Partners']);
    if (existingService.length === 0) {
      await connection.query(`
        INSERT INTO services (name, icon_name, bg_color, icon_color, route_path, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Offline Partners', 'Landmark', '#f5f3ff', '#7c3aed', '/offline-partners', 1]);
      console.log('Added Offline Partners to services table.');
    } else {
      console.log('Offline Partners service already exists.');
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
