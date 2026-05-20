require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'finxpert'
    });

    try {
        console.log('Creating offline_applications table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS offline_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT NOT NULL,
                
                -- Step 1
                loan_amount VARCHAR(50),
                loan_tenure VARCHAR(50),
                loan_type VARCHAR(100),
                current_emi VARCHAR(50),
                
                -- Step 2
                full_name VARCHAR(255),
                dob VARCHAR(50),
                marital_status VARCHAR(50),
                phone VARCHAR(50),
                email VARCHAR(255),
                address TEXT,
                resident_type VARCHAR(50),
                same_as_aadhar BOOLEAN DEFAULT TRUE,
                aadhar_address TEXT,
                
                -- Step 3
                company_name VARCHAR(255),
                company_address TEXT,
                designation VARCHAR(100),
                monthly_salary VARCHAR(50),
                salary_mode VARCHAR(50),
                official_phone VARCHAR(50),
                official_email VARCHAR(255),
                
                -- Step 4
                ref1_name VARCHAR(255),
                ref1_phone VARCHAR(50),
                ref1_address TEXT,
                ref2_name VARCHAR(255),
                ref2_phone VARCHAR(50),
                ref2_address TEXT,
                
                -- Step 5 Files
                pan_file_url VARCHAR(255),
                aadhar_front_url VARCHAR(255),
                aadhar_back_url VARCHAR(255),
                bank_statement_url VARCHAR(255),
                salary_slip_1_url VARCHAR(255),
                salary_slip_2_url VARCHAR(255),
                salary_slip_3_url VARCHAR(255),
                form16_url VARCHAR(255),
                electricity_bill_url VARCHAR(255),
                
                status ENUM('pending', 'approved', 'rejected', 'under review') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        console.log('Successfully created offline_applications table.');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await db.end();
    }
}

migrate();
