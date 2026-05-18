const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database "${process.env.DB_NAME}" created or already exists.`);
        
        await connection.query(`USE \`${process.env.DB_NAME}\``);

        // Create Partners table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS partners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'partner') DEFAULT 'partner',
                referral_code VARCHAR(100) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Add missing columns if table already exists (safe migration)
        await connection.query(`
            ALTER TABLE partners 
            ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER name,
            ADD COLUMN IF NOT EXISTS referral_code VARCHAR(100) DEFAULT NULL AFTER role
        `).catch(() => {}); // Ignore if columns already exist
        console.log('Partners table created.');

        // Create Leads table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT,
                customer_name VARCHAR(255) NOT NULL,
                service_type VARCHAR(100),
                status ENUM('new', 'in-progress', 'completed', 'rejected') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        console.log('Leads table created.');

        // Create Banners table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                bank_name VARCHAR(100),
                title VARCHAR(255) NOT NULL,
                subtitle TEXT,
                bg_color VARCHAR(20) DEFAULT '#f4f5f9',
                accent_color VARCHAR(20) DEFAULT '#E31E24',
                image_url VARCHAR(255),
                page_type ENUM('home', 'product') DEFAULT 'home',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Banners table created.');

        // Create Services table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                icon_name VARCHAR(50),
                bg_color VARCHAR(20),
                icon_color VARCHAR(20),
                route_path VARCHAR(100),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Services table created.');

        // Create Products table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                service_id INT,
                name VARCHAR(255) NOT NULL,
                bank_name VARCHAR(100),
                logo_url VARCHAR(255),
                earn_amount VARCHAR(50),
                features JSON,
                joining_fee VARCHAR(50),
                renewal_fee VARCHAR(50),
                is_featured BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (service_id) REFERENCES services(id)
            )
        `);
        console.log('Products table created.');

        // Create Wallet Transactions table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS wallet_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT,
                amount DECIMAL(10, 2) NOT NULL,
                type ENUM('credit', 'debit') NOT NULL,
                status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        console.log('Wallet Transactions table created.');

        // Create KYC Verifications table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS kyc_verifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                aadhar_number VARCHAR(20) NOT NULL,
                aadhar_front_url VARCHAR(255) NOT NULL,
                aadhar_back_url VARCHAR(255) NOT NULL,
                pan_number VARCHAR(20) NOT NULL,
                pan_card_url VARCHAR(255) NOT NULL,
                profile_photo_url VARCHAR(255) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
            )
        `);
        console.log('KYC Verifications table created.');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await connection.end();
    }
}

initDB();
