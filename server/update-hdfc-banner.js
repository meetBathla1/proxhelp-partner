const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Update share_image_url for the Swiggy HDFC Bank Card to the local SVG banner
  await c.query(
    "UPDATE products SET share_image_url = '/banners/hdfc-swiggy-share.svg' WHERE id = 3"
  );
  console.log('Updated Swiggy HDFC Bank Card share_image_url to /banners/hdfc-swiggy-share.svg');

  // Verify the update
  const [rows] = await c.query("SELECT id, name, share_image_url FROM products WHERE id = 3");
  console.log('Verification:', JSON.stringify(rows[0], null, 2));

  await c.end();
})();
