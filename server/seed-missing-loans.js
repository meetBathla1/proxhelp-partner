const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedMissingLoans() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding missing loan data to database...');

        const [serviceRows] = await connection.query('SELECT id, name FROM services');
        const s = serviceRows.reduce((acc, row) => {
            acc[row.name] = row.id;
            return acc;
        }, {});

        const insertProduct = async (data) => {
            await connection.query(
                `INSERT INTO products (service_id, name, bank_name, logo_url, earn_amount, features, joining_fee, renewal_fee) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [data.sid, data.name, data.bank, data.logo, data.earn, JSON.stringify(data.features), '0', '0']
            );
        };

        // ── BUSINESS LOANS ──
        await insertProduct({
            sid: s['Business Loans'], name: 'Lendingkart Business Loan', bank: 'Lendingkart',
            logo: 'https://www.lendingkart.com/wp-content/uploads/2019/05/Lendingkart-Logo.png',
            earn: '2.50%',
            features: [{icon: '📈', text: 'Unsecured business loans'}, {icon: '⚡', text: 'Approval in 24 hours'}, {icon: '📄', text: 'Minimal documentation'}]
        });
        await insertProduct({
            sid: s['Business Loans'], name: 'Ziploan Quick Business Loan', bank: 'Ziploan',
            logo: 'https://ziploan.in/static/media/logo.0894563a.png',
            earn: '2.80%',
            features: [{icon: '💵', text: 'Loan up to ₹7.5 Lakhs'}, {icon: '📅', text: 'Flexible tenure 12-36 months'}, {icon: '🚀', text: 'Quick digital processing'}]
        });

        // ── MICRO LOAN ──
        await insertProduct({
            sid: s['Micro Loan'], name: 'Fusion Microfinance Loan', bank: 'Fusion Microfinance',
            logo: 'https://fusionmicrofinance.com/wp-content/uploads/2021/08/fusion-logo.png',
            earn: '₹1200',
            features: [{icon: '👩', text: 'Focus on women entrepreneurs'}, {icon: '💰', text: 'Small ticket sizes'}, {icon: '🤝', text: 'Easy group-based lending'}]
        });
        await insertProduct({
            sid: s['Micro Loan'], name: 'Annapurna Finance Micro Loan', bank: 'Annapurna Finance',
            logo: 'https://annapurnafinance.in/wp-content/uploads/2020/09/Logo.png',
            earn: '1.50%',
            features: [{icon: '🌾', text: 'Rural focus'}, {icon: '📈', text: 'Supports livelihood activities'}, {icon: '🛡️', text: 'Trusted by millions'}]
        });

        // ── GROUP LOAN ──
        await insertProduct({
            sid: s['Group Loan'], name: 'Muthoot Microfin Group Loan', bank: 'Muthoot Microfin',
            logo: 'https://muthootmicrofin.com/wp-content/uploads/2021/11/Logo-1.png',
            earn: '₹1500',
            features: [{icon: '👥', text: 'Community-based lending'}, {icon: '⚡', text: 'Hassle-free documentation'}, {icon: '📉', text: 'Low interest rates'}]
        });
        await insertProduct({
            sid: s['Group Loan'], name: 'L&T Finance Group Loan', bank: 'L&T Finance',
            logo: 'https://www.ltfs.com/content/dam/lnt-financial-services/images/logo/lt-logo.svg',
            earn: '2.00%',
            features: [{icon: '🏢', text: 'Strong institutional backing'}, {icon: '✅', text: 'Transparent process'}, {icon: '📱', text: 'Manage via mobile app'}]
        });

        console.log('Successfully added Business, Micro, and Group loans!');
    } catch (error) {
        console.error('Error seeding missing loans:', error);
    } finally {
        await connection.end();
    }
}

seedMissingLoans();
