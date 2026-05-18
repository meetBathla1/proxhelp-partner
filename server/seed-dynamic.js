const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDynamic() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Migrating all original products to database...');

        // 1. Get Service IDs
        const [serviceRows] = await connection.query('SELECT id, name FROM services');
        const s = serviceRows.reduce((acc, row) => {
            acc[row.name] = row.id;
            return acc;
        }, {});

        // Helper to insert products
        const insertProduct = async (data) => {
            await connection.query(
                `INSERT INTO products (service_id, name, bank_name, logo_url, earn_amount, features, joining_fee, renewal_fee, is_featured) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [data.sid, data.name, data.bank, data.logo, data.earn, JSON.stringify(data.features), data.jf || '0', data.rf || '0', data.feat || false]
            );
        };

        // Clear existing products to avoid duplicates during this full migration
        await connection.query('DELETE FROM products');
        console.log('Cleared existing products for clean migration.');

        // ── CREDIT CARDS ──
        await insertProduct({
            sid: s['Credit Card'], name: 'Swiggy HDFC Bank Card', bank: 'HDFC Bank',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg',
            earn: '2300', feat: true, jf: '499', rf: '499',
            features: [{icon: '🍔', text: '10% Cashback on Swiggy'}, {icon: '🛍️', text: '5% Cashback on Online Shopping'}, {icon: '💎', text: 'Free Swiggy One Membership'}]
        });
        await insertProduct({
            sid: s['Credit Card'], name: 'AU Bank Altura Plus', bank: 'AU Small Finance Bank',
            logo: 'https://www.aubank.in/assets/images/au-logo.png',
            earn: '2100', jf: '499', rf: '499',
            features: [{icon: '💳', text: '1.5% Reward Points on POS'}, {icon: '🎟️', text: 'Buy 1 Get 1 Movie Tickets'}, {icon: '✈️', text: 'Railway Lounge Access'}]
        });

        // ── SECURED CARDS ──
        await insertProduct({
            sid: s['Secured Card'], name: 'Stable Money FD Card', bank: 'Stable Money',
            logo: 'https://stablemoney.in/assets/logo.svg',
            earn: '1600', jf: '0', rf: '0',
            features: [{icon: '💳', text: 'FD-backed card'}, {icon: '🏦', text: 'Higher FD returns vs bank average'}, {icon: '🌐', text: '100% digital process'}]
        });
        await insertProduct({
            sid: s['Secured Card'], name: 'SBM ZET FD Credit Card', bank: 'SBM Bank',
            logo: 'https://www.sbmbank.co.in/images/logo.png',
            earn: '800', jf: '0', rf: '0',
            features: [{icon: '💡', text: 'FD start from just ₹2000'}, {icon: '📱', text: 'Easy approval no income proof'}, {icon: '📈', text: 'Helps build / improve CIBIL score'}]
        });

        // ── PERSONAL LOAN ──
        await insertProduct({
            sid: s['Personal Loan'], name: 'IndusInd Bank Personal Loan', bank: 'IndusInd Bank',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/IndusInd_Bank_logo.svg',
            earn: '2.60%', jf: 'Up to 2%', rf: '0',
            features: [{icon: '🌐', text: 'Digital approval'}, {icon: '⚡', text: 'Fast disbursal'}, {icon: '💡', text: 'No collateral required'}]
        });
        await insertProduct({
            sid: s['Personal Loan'], name: 'Unity Personal Loan', bank: 'Unity Bank',
            logo: 'https://www.unity.bank/images/logo.png',
            earn: '2.70%', jf: '0', rf: '0',
            features: [{icon: '📱', text: 'Approval in just 2 Minutes'}, {icon: '💡', text: 'No Income Proof Required'}, {icon: '🌐', text: 'Digital Process'}]
        });
        await insertProduct({
            sid: s['Personal Loan'], name: 'Tata Capital Personal Loan', bank: 'Tata Capital',
            logo: 'https://www.tatacapital.com/content/dam/tata-capital/header-footer/Tata%20Capital%20Logo.svg',
            earn: '2.20%', jf: '2%', rf: '0',
            features: [{icon: '⚡', text: 'Quick approval & fast disbursal'}, {icon: '🌐', text: '100% digital process'}, {icon: '💵', text: 'Loan amount up to ₹35 lakh'}]
        });

        // ── INSTANT LOAN ──
        await insertProduct({
            sid: s['Instant Loan'], name: 'KreditBee Instant Loan', bank: 'KreditBee',
            logo: 'https://www.kreditbee.in/assets/images/logo.png',
            earn: '3.20%', jf: 'Variable', rf: '0',
            features: [{icon: '⚡', text: 'Loan in 10 minutes'}, {icon: '📱', text: '100% Online process'}, {icon: '💵', text: 'Up to ₹4 Lakhs'}]
        });
        await insertProduct({
            sid: s['Instant Loan'], name: 'Fibe (EarlySalary)', bank: 'Fibe',
            logo: 'https://www.fibe.in/assets/images/logo.png',
            earn: '₹1000', jf: '0', rf: '0',
            features: [{icon: '🚀', text: 'Instant approval for salaried'}, {icon: '💳', text: 'Limit up to ₹5 Lakhs'}, {icon: '📅', text: 'Flexible repayment'}]
        });

        // ── SAVINGS ACCOUNT ──
        await insertProduct({
            sid: s['Savings Account'], name: 'Kotak 811 Savings Account', bank: 'Kotak Mahindra Bank',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Kotak_Mahindra_Bank_logo.svg',
            earn: '₹350', jf: '0', rf: '0',
            features: [{icon: '🏦', text: 'Zero Balance Account'}, {icon: '📈', text: 'Up to 4% interest p.a.'}, {icon: '📱', text: 'Instant Video KYC'}]
        });
        await insertProduct({
            sid: s['Savings Account'], name: 'AU Digital Savings Account', bank: 'AU Small Finance Bank',
            logo: 'https://www.aubank.in/assets/images/au-logo.png',
            earn: '₹800', jf: '0', rf: '0',
            features: [{icon: '💰', text: 'Monthly interest payout'}, {icon: '💳', text: 'High-limit Debit Card'}, {icon: '🌐', text: 'Paperless onboarding'}]
        });

        // ── DEMAT ACCOUNT ──
        await insertProduct({
            sid: s['Demat Account'], name: 'Upstox Demat Account', bank: 'Upstox',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Upstox_logo.png',
            earn: '₹400', jf: '0', rf: '0',
            features: [{icon: '📈', text: 'Zero brokerage on Mutual Funds'}, {icon: '📱', text: 'Easy-to-use trading app'}, {icon: '⚡', text: 'Account open in 5 mins'}]
        });
        await insertProduct({
            sid: s['Demat Account'], name: 'm.Stock by Mirae Asset', bank: 'm.Stock',
            logo: 'https://www.mstock.com/assets/images/mstock-logo.svg',
            earn: '₹550', jf: '999', rf: '0',
            features: [{icon: '💎', text: 'Lifetime Zero Brokerage'}, {icon: '📊', text: 'Advanced charting tools'}, {icon: '🛡️', text: 'Secure & Trusted'}]
        });

        // ── INSURANCE ──
        await insertProduct({
            sid: s['Insurance'], name: 'HDFC ERGO Health Insurance', bank: 'HDFC ERGO',
            logo: 'https://www.hdfcergo.com/images/default-source/logos/hdfc-ergo-logo.svg',
            earn: '15%', jf: 'Variable', rf: 'Annual',
            features: [{icon: '🏥', text: 'Cashless treatment'}, {icon: '🛡️', text: 'Tax benefits under 80D'}, {icon: '🚑', text: 'Emergency ambulance cover'}]
        });

        console.log('All original products successfully migrated to database!');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await connection.end();
    }
}

seedDynamic();
