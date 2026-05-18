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

    console.log('Migrating database...');

    // 1. Add redirect_url to products
    try {
      await c.query('ALTER TABLE products ADD COLUMN redirect_url VARCHAR(500) DEFAULT NULL');
      console.log('✅ Added redirect_url to products.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('✅ redirect_url already exists in products.');
      else throw e;
    }

    // 2. Add customer_phone to leads
    try {
      await c.query('ALTER TABLE leads ADD COLUMN customer_phone VARCHAR(20) DEFAULT NULL');
      console.log('✅ Added customer_phone to leads.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('✅ customer_phone already exists in leads.');
      else throw e;
    }

    // 3. Add customer_pincode to leads
    try {
      await c.query('ALTER TABLE leads ADD COLUMN customer_pincode VARCHAR(10) DEFAULT NULL');
      console.log('✅ Added customer_pincode to leads.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('✅ customer_pincode already exists in leads.');
      else throw e;
    }

    // 4. Add product_id to leads
    try {
      await c.query('ALTER TABLE leads ADD COLUMN product_id INT DEFAULT NULL');
      console.log('✅ Added product_id to leads.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('✅ product_id already exists in leads.');
      else throw e;
    }

    // Seed dummy redirect URLs for existing products for testing
    await c.query("UPDATE products SET redirect_url = 'https://apply.hdfcbank.com/vivid/video_kyc' WHERE id = 3");
    await c.query("UPDATE products SET redirect_url = 'https://www.aubank.in/cards/credit-card/altura-plus-credit-card' WHERE id = 4");
    await c.query("UPDATE products SET redirect_url = 'https://stablemoney.in/cards' WHERE id = 5");

    console.log('✅ Added dummy redirect URLs for core products.');

    await c.end();
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
})();
