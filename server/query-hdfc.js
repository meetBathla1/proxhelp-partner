const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  const [rows] = await c.query("SELECT id, name, bank_name, share_image_url FROM products WHERE bank_name LIKE '%HDFC%' OR name LIKE '%HDFC%'");
  console.log(JSON.stringify(rows, null, 2));
  await c.end();
})();
