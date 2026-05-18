const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  const [rows] = await c.query("SELECT id, name, bank_name, service_id, share_image_url, features, earn_amount FROM products WHERE is_active = 1 ORDER BY service_id, id");
  console.log(JSON.stringify(rows, null, 2));
  await c.end();
})();
