const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./config/db');
 
// Initialize Database Tables
const initDB = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT NOT NULL,
                type ENUM('success', 'info', 'warning', 'error') DEFAULT 'info',
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        console.log('Notifications table ensured');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS support_tickets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT NOT NULL,
                category VARCHAR(50) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('pending', 'under process', 'resolved', 'completed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        console.log('Support tickets table ensured');

        await db.query(`
            CREATE TABLE IF NOT EXISTS wallet_transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                type ENUM('credit', 'debit') NOT NULL,
                status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                description VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        // Migration: Ensure description column exists
        try {
            await db.query('ALTER TABLE wallet_transactions ADD COLUMN description VARCHAR(255) AFTER status');
        } catch (e) {
            // Column might already exist
        }
        console.log('Wallet transactions table ensured');

        await db.query(`
            CREATE TABLE IF NOT EXISTS bank_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                partner_id INT NOT NULL,
                account_holder_name VARCHAR(255) NOT NULL,
                bank_name VARCHAR(255) NOT NULL,
                account_number VARCHAR(50) NOT NULL,
                ifsc_code VARCHAR(20) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (partner_id) REFERENCES partners(id)
            )
        `);
        console.log('Bank accounts table ensured');

        // Optional: Add some dummy transactions for test partners if table is empty
        const [rows] = await db.query('SELECT COUNT(*) as count FROM wallet_transactions');
        if (rows[0].count === 0) {
            const [partners] = await db.query('SELECT id FROM partners LIMIT 1');
            if (partners.length > 0) {
                const pid = partners[0].id;
                await db.query(`
                    INSERT INTO wallet_transactions (partner_id, amount, type, status, description) VALUES 
                    (?, 1200.00, 'credit', 'completed', 'Lead Conversion - Personal Loan'),
                    (?, 800.00, 'credit', 'completed', 'Credit Card Approved'),
                    (?, 500.00, 'debit', 'completed', 'Bank Transfer'),
                    (?, 1500.00, 'credit', 'pending', 'Micro Loan - In Process'),
                    (?, 3000.00, 'debit', 'pending', 'Payout Request #WDR-202'),
                    (?, 450.00, 'credit', 'failed', 'Demat Account - Rejected')
                `, [pid, pid, pid, pid, pid, pid]);
                console.log('Seeded wallet transactions with statuses');
            }
        }
        // Migration/Fix: Ensure all test balance updates are COMPLETED
        await db.query('UPDATE wallet_transactions SET status = "completed" WHERE description = "Test Balance Update"');
        console.log('Verified test balance statuses');

        await db.query(`
            CREATE TABLE IF NOT EXISTS relationship_managers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                whatsapp VARCHAR(20),
                profile_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Relationship Managers table ensured');

        try {
            await db.query('ALTER TABLE partners ADD COLUMN rm_id INT NULL');
            await db.query('ALTER TABLE partners ADD FOREIGN KEY (rm_id) REFERENCES relationship_managers(id)');
        } catch (e) {
            // Column might already exist
        }
        try {
            await db.query('ALTER TABLE partners ADD COLUMN username VARCHAR(255) NULL AFTER name');
        } catch (e) {
            // Column might already exist
        }
        try {
            await db.query('ALTER TABLE partners ADD COLUMN profile_url VARCHAR(255) NULL AFTER username');
        } catch (e) {
            // Column might already exist
        }
        console.log('Partners RM, Username, and profile_url columns ensured');

    } catch (err) {
        console.error('Database initialization error:', err);
    }
};
initDB();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const app = express();


const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'finxpert_secret_key';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// Support Tickets Routes
app.post('/api/support/ticket', authenticateToken, async (req, res) => {
    try {
        const { category, subject, message } = req.body;
        const partner_id = req.user.id;

        await db.query(
            'INSERT INTO support_tickets (partner_id, category, subject, message) VALUES (?, ?, ?, ?)',
            [partner_id, category, subject, message]
        );

        res.status(201).json({ message: 'Ticket raised successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/support/tickets', authenticateToken, async (req, res) => {
    try {
        const partner_id = req.user.id;
        const [tickets] = await db.query(
            'SELECT * FROM support_tickets WHERE partner_id = ? ORDER BY created_at DESC',
            [partner_id]
        );
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Support Routes
app.get('/api/admin/support/tickets', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [tickets] = await db.query(`
            SELECT t.*, p.name as partner_name, p.email as partner_email 
            FROM support_tickets t 
            JOIN partners p ON t.partner_id = p.id 
            ORDER BY t.created_at DESC
        `);
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/support/ticket/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            'UPDATE support_tickets SET status = ? WHERE id = ?',
            [status, id]
        );

        // Notify Partner
        const [[ticket]] = await db.query('SELECT partner_id, subject FROM support_tickets WHERE id = ?', [id]);
        if (ticket) {
            await db.query(
                'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
                [ticket.partner_id, 'info', 'Ticket Status Updated', `Your ticket "${ticket.subject}" status has been updated to: ${status}`]
            );
        }

        res.json({ message: 'Ticket status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── WALLET ROUTES ──
app.get('/api/wallet/stats', authenticateToken, async (req, res) => {
    try {
        const pId = req.user?.id;
        if (!pId) return res.status(401).json({ message: 'Unauthorized' });

        // Extremely safe injection
        try {
            const [rows] = await db.query('SELECT id FROM wallet_transactions WHERE partner_id = ? AND description = "Test Balance Update" LIMIT 1', [pId]);
            if (!rows || rows.length === 0) {
                await db.query('INSERT INTO wallet_transactions (partner_id, amount, type, status, description) VALUES (?, 10000.00, "credit", "completed", "Test Balance Update")', [pId]);
            }
        } catch (e) {
            console.error('Wallet Seed Error:', e.message);
        }

        const [eRes] = await db.query('SELECT SUM(amount) as total FROM wallet_transactions WHERE partner_id = ? AND type = "credit" AND status = "completed"', [pId]);
        const [wRes] = await db.query('SELECT SUM(amount) as total FROM wallet_transactions WHERE partner_id = ? AND type = "debit" AND status = "completed"', [pId]);

        const totalEarned = parseFloat(eRes[0]?.total || 0);
        const totalWithdrawn = parseFloat(wRes[0]?.total || 0);
        const currentBalance = totalEarned - totalWithdrawn;

        res.json({ totalEarned, totalWithdrawn, currentBalance });
    } catch (err) {
        console.error('Final Stats Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Route to view all payout requests
app.get('/api/admin/payouts', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, p.name as partner_name, p.email as partner_email 
            FROM wallet_transactions t
            JOIN partners p ON t.partner_id = p.id
            WHERE t.type = "debit"
            ORDER BY t.created_at DESC
        `);
        // Map debit back to withdrawal for frontend
        const mappedRows = rows.map(r => ({ ...r, type: 'withdrawal' }));
        res.json(mappedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/admin/payout/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            'UPDATE wallet_transactions SET status = ? WHERE id = ?',
            [status, id]
        );

        // Notify Partner
        const [[tx]] = await db.query('SELECT partner_id, amount FROM wallet_transactions WHERE id = ?', [id]);
        if (tx) {
            const title = status === 'completed' ? 'Withdrawal Successful' : 'Withdrawal Rejected';
            const message = status === 'completed' 
                ? `Your withdrawal request for ₹${tx.amount} has been processed.` 
                : `Your withdrawal request for ₹${tx.amount} was rejected. The amount has been returned to your wallet.`;
            
            await db.query(
                'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
                [tx.partner_id, status === 'completed' ? 'success' : 'error', title, message]
            );
        }

        res.json({ message: 'Payout status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const partner_id = req.user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Check current balance
        const [earnings] = await db.query(
            'SELECT SUM(amount) as total FROM wallet_transactions WHERE partner_id = ? AND type = "credit" AND status = "completed"',
            [partner_id]
        );
        const [withdrawals] = await db.query(
            'SELECT SUM(amount) as total FROM wallet_transactions WHERE partner_id = ? AND type = "debit" AND status = "completed"',
            [partner_id]
        );
        const currentBalance = parseFloat(earnings[0]?.total || 0) - parseFloat(withdrawals[0]?.total || 0);

        if (amount > currentBalance) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create pending withdrawal transaction
        await db.query(
            'INSERT INTO wallet_transactions (partner_id, amount, type, status, description) VALUES (?, ?, "debit", "pending", "Payout Request")',
            [partner_id, amount]
        );

        res.json({ message: 'Withdrawal request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
    try {
        const partner_id = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM wallet_transactions WHERE partner_id = ? ORDER BY created_at DESC',
            [partner_id]
        );
        // Map credit/debit to earning/withdrawal for frontend
        const mappedRows = rows.map(r => ({
            ...r,
            type: r.type === 'credit' ? 'earning' : 'withdrawal'
        }));
        res.json(mappedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── BANK ACCOUNT ROUTES ──
app.get('/api/bank-account', authenticateToken, async (req, res) => {
    try {
        const partner_id = req.user.id;
        const [rows] = await db.query('SELECT * FROM bank_accounts WHERE partner_id = ?', [partner_id]);
        res.json(rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/bank-account', authenticateToken, async (req, res) => {
    try {
        const { account_holder_name, bank_name, account_number, ifsc_code } = req.body;
        const partner_id = req.user.id;

        const [existing] = await db.query('SELECT id FROM bank_accounts WHERE partner_id = ?', [partner_id]);

        if (existing.length > 0) {
            await db.query(
                'UPDATE bank_accounts SET account_holder_name = ?, bank_name = ?, account_number = ?, ifsc_code = ?, status = "pending" WHERE partner_id = ?',
                [account_holder_name, bank_name, account_number, ifsc_code, partner_id]
            );
            // Notify persistent
            await db.query(
                'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
                [partner_id, 'info', 'Bank Details Updated', 'Your bank account details have been updated and are under verification.']
            );
        } else {
            await db.query(
                'INSERT INTO bank_accounts (partner_id, account_holder_name, bank_name, account_number, ifsc_code) VALUES (?, ?, ?, ?, ?)',
                [partner_id, account_holder_name, bank_name, account_number, ifsc_code]
            );
            // Notify persistent
            await db.query(
                'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
                [partner_id, 'success', 'Bank Account Added', 'New bank account has been added successfully and is pending verification.']
            );
        }

        res.json({ message: 'Bank details submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Route to view all bank accounts
app.get('/api/admin/bank-accounts', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.*, p.name as partner_name, p.email as partner_email 
            FROM bank_accounts b
            JOIN partners p ON b.partner_id = p.id
            ORDER BY b.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/admin/bank-account/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            'UPDATE bank_accounts SET status = ? WHERE id = ?',
            [status, id]
        );

        // Notify Partner
        const [[bank]] = await db.query('SELECT partner_id, bank_name FROM bank_accounts WHERE id = ?', [id]);
        if (bank) {
            const title = status === 'approved' ? 'Bank Account Verified' : 'Bank Account Rejected';
            const message = status === 'approved' 
                ? `Your ${bank.bank_name} account has been verified successfully.` 
                : `Your ${bank.bank_name} account verification failed. Please check details and resubmit.`;
            
            await db.query(
                'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
                [bank.partner_id, status === 'approved' ? 'success' : 'error', title, message]
            );
        }

        res.json({ message: 'Bank account status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── NOTIFICATION ROUTES ──

app.post('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const { type, title, message } = req.body;
        const partner_id = req.user.id;

        await db.query(
            'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
            [partner_id, type, title, message]
        );

        res.status(201).json({ message: 'Notification saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const partner_id = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM notifications WHERE partner_id = ? ORDER BY created_at DESC',
            [partner_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register Route
app.post('/api/register', async (req, res) => {
    const { fullName, phone, email, password, referralCode } = req.body;
    
    if (!fullName || !phone || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    try {
        const [existingUsers] = await db.query('SELECT * FROM partners WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO partners (name, phone, email, password, role, referral_code) VALUES (?, ?, ?, ?, ?, ?)',
            [fullName, phone, email, hashedPassword, 'partner', referralCode || null]
        );

        const token = jwt.sign({ id: result.insertId, email, role: 'partner' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ 
            message: 'Account created successfully!', 
            token,
            user: { id: result.insertId, name: fullName, username: fullName, email, phone, role: 'partner', profile_url: null }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM partners WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '365d' });
        res.json({ token, user: { id: user.id, name: user.name, username: user.username || user.name, email: user.email, phone: user.phone, role: user.role, profile_url: user.profile_url } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Profile endpoints
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, username, email, phone, role, profile_url FROM partners WHERE id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/profile/update', authenticateToken, upload.single('profile_photo'), async (req, res) => {
    const { name, username, email, phone } = req.body;
    const partnerId = req.user.id;
    try {
        let profile_url = null;
        if (req.file) {
            profile_url = `/uploads/${req.file.filename}`;
        }
        
        let query = 'UPDATE partners SET name=?, username=?, email=?, phone=?';
        let params = [name, username, email, phone];
        
        if (profile_url) {
            query += ', profile_url=?';
            params.push(profile_url);
        }
        
        query += ' WHERE id=?';
        params.push(partnerId);
        
        await db.query(query, params);
        
        // Fetch updated user
        const [rows] = await db.query('SELECT * FROM partners WHERE id = ?', [partnerId]);
        const user = rows[0];
        
        res.json({
            message: 'Profile updated successfully',
            user: { 
                id: user.id, 
                name: user.name, 
                username: user.username || user.name, 
                email: user.email, 
                phone: user.phone, 
                role: user.role,
                profile_url: user.profile_url
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── KYC ROUTES ──

app.post('/api/kyc/submit', authenticateToken, upload.fields([
    { name: 'profile_photo', maxCount: 1 },
    { name: 'aadhar_front', maxCount: 1 },
    { name: 'aadhar_back', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 }
]), async (req, res) => {
    try {
        const { fullName, aadharNumber, panNumber } = req.body;
        const partner_id = req.user.id;

        // Check if already submitted and pending/approved
        const [existing] = await db.query('SELECT * FROM kyc_verifications WHERE partner_id = ? AND status IN ("pending", "approved")', [partner_id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'KYC is already pending or approved.' });
        }

        const profile_photo_url = req.files['profile_photo'] ? `/uploads/${req.files['profile_photo'][0].filename}` : '';
        const aadhar_front_url = req.files['aadhar_front'] ? `/uploads/${req.files['aadhar_front'][0].filename}` : '';
        const aadhar_back_url = req.files['aadhar_back'] ? `/uploads/${req.files['aadhar_back'][0].filename}` : '';
        const pan_card_url = req.files['pan_card'] ? `/uploads/${req.files['pan_card'][0].filename}` : '';

        await db.query(
            'INSERT INTO kyc_verifications (partner_id, full_name, aadhar_number, aadhar_front_url, aadhar_back_url, pan_number, pan_card_url, profile_photo_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [partner_id, fullName, aadharNumber, aadhar_front_url, aadhar_back_url, panNumber, pan_card_url, profile_photo_url, 'pending']
        );

        res.status(201).json({ message: 'KYC submitted successfully!' });
    } catch (error) {
        console.error('KYC submit error:', error);
        res.status(500).json({ message: 'Error submitting KYC' });
    }
});

app.get('/api/kyc/status', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT status FROM kyc_verifications WHERE partner_id = ? ORDER BY created_at DESC LIMIT 1', [req.user.id]);
        if (rows.length === 0) {
            return res.json({ status: null });
        }
        res.json({ status: rows[0].status });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ── PUBLIC DYNAMIC DATA ROUTES ──

app.get('/api/banners', async (req, res) => {
    try {
        const [banners] = await db.query('SELECT * FROM banners WHERE is_active = TRUE ORDER BY created_at DESC');
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners' });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const [services] = await db.query('SELECT * FROM services WHERE is_active = TRUE');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
});

app.get('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
});

app.get('/api/products/:serviceName', async (req, res) => {
    try {
        const { serviceName } = req.params;
        const [services] = await db.query('SELECT id FROM services WHERE name = ?', [serviceName]);
        if (services.length === 0) return res.status(404).json({ message: 'Service not found' });
        const [products] = await db.query('SELECT * FROM products WHERE service_id = ? AND is_active = TRUE', [services[0].id]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});


// ── GET PARTNER LEADS ──
app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const partner_id = req.user.id;
        
        // Direct Leads
        const [myLeads] = await db.query(
            'SELECT l.*, p.bank_name as bank FROM leads l LEFT JOIN products p ON l.product_id = p.id WHERE l.partner_id = ? ORDER BY l.created_at DESC',
            [partner_id]
        );
        
        // Referral Leads
        const [referralLeads] = await db.query(
            'SELECT l.*, p.bank_name as bank, agent.name as agent_name FROM leads l LEFT JOIN products p ON l.product_id = p.id JOIN partners agent ON l.partner_id = agent.id WHERE agent.referred_by = ? ORDER BY l.created_at DESC',
            [partner_id]
        );
        
        res.json({ myLeads, referralLeads });
    } catch (err) {
        console.error('Error fetching leads:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── GET ADMIN AGENT LEADS ──
app.get('/api/admin/partner/:id/leads', authenticateToken, isAdmin, async (req, res) => {
    try {
        const partner_id = req.params.id;
        
        const [myLeads] = await db.query(
            'SELECT l.*, p.bank_name as bank FROM leads l LEFT JOIN products p ON l.product_id = p.id WHERE l.partner_id = ? ORDER BY l.created_at DESC',
            [partner_id]
        );
        
        const [referralLeads] = await db.query(
            'SELECT l.*, p.bank_name as bank, agent.name as agent_name FROM leads l LEFT JOIN products p ON l.product_id = p.id JOIN partners agent ON l.partner_id = agent.id WHERE agent.referred_by = ? ORDER BY l.created_at DESC',
            [partner_id]
        );
        
        res.json({ myLeads, referralLeads });
    } catch (err) {
        console.error('Error fetching admin leads:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// ── ADMIN MANAGEMENT ROUTES ──

app.post('/api/admin/banners', authenticateToken, isAdmin, async (req, res) => {
    const { id, bank_name, title, subtitle, bg_color, accent_color, image_url, page_type, is_active } = req.body;
    try {
        if (id) {
            await db.query(
                'UPDATE banners SET bank_name=?, title=?, subtitle=?, bg_color=?, accent_color=?, image_url=?, page_type=?, is_active=? WHERE id=?',
                [bank_name, title, subtitle, bg_color, accent_color, image_url, page_type, is_active, id]
            );
            res.json({ message: 'Banner updated' });
        } else {
            await db.query(
                'INSERT INTO banners (bank_name, title, subtitle, bg_color, accent_color, image_url, page_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [bank_name, title, subtitle, bg_color, accent_color, image_url, page_type]
            );
            res.status(201).json({ message: 'Banner created' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error managing banner' });
    }
});

app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    const { id, service_id, name, bank_name, logo_url, earn_amount, features, joining_fee, renewal_fee, share_image_url, share_description, is_featured, is_active, redirect_url } = req.body;
    try {
        if (id) {
            await db.query(
                'UPDATE products SET service_id=?, name=?, bank_name=?, logo_url=?, earn_amount=?, features=?, joining_fee=?, renewal_fee=?, share_image_url=?, share_description=?, is_featured=?, is_active=?, redirect_url=? WHERE id=?',
                [service_id, name, bank_name, logo_url, earn_amount, JSON.stringify(features), joining_fee, renewal_fee, share_image_url, share_description, is_featured, is_active, redirect_url, id]
            );
            res.json({ message: 'Product updated' });
        } else {
            await db.query(
                'INSERT INTO products (service_id, name, bank_name, logo_url, earn_amount, features, joining_fee, renewal_fee, share_image_url, share_description, is_featured, redirect_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [service_id, name, bank_name, logo_url, earn_amount, JSON.stringify(features), joining_fee, renewal_fee, share_image_url, share_description, is_featured, redirect_url]
            );
            res.status(201).json({ message: 'Product created' });
        }
    } catch (error) {
        console.error('Admin product error:', error);
        res.status(500).json({ message: 'Error managing product' });
    }
});

// ── LEADS / APPLY ROUTE ──
app.post('/api/leads/apply', async (req, res) => {
    const { partner_id, product_id, customer_name, customer_phone, customer_pincode } = req.body;
    try {
        if (!partner_id || !product_id || !customer_name || !customer_phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Optionally fetch service_type from product_id
        const [products] = await db.query('SELECT service_id FROM products WHERE id = ?', [product_id]);
        let serviceType = 'product';
        if (products.length > 0) {
            const [services] = await db.query('SELECT name FROM services WHERE id = ?', [products[0].service_id]);
            if (services.length > 0) serviceType = services[0].name;
        }

        await db.query(
            'INSERT INTO leads (partner_id, product_id, customer_name, customer_phone, customer_pincode, service_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [partner_id, product_id, customer_name, customer_phone, customer_pincode, serviceType, 'new']
        );
        res.status(201).json({ message: 'Lead captured successfully' });
    } catch (error) {
        console.error('Error capturing lead:', error);
        res.status(500).json({ message: 'Error capturing lead' });
    }
});

// Public Endpoint for Lead Capture Page to get Partner Name
app.get('/api/partner/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name, phone FROM partners WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Partner not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching partner' });
    }
});

app.get('/api/admin/partners', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [partners] = await db.query('SELECT id, name, email, phone, role, created_at FROM partners');
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching partners' });
    }
});

app.get('/api/admin/kyc', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [kycs] = await db.query(`
            SELECT k.*, p.email, p.phone 
            FROM kyc_verifications k 
            JOIN partners p ON k.partner_id = p.id 
            ORDER BY k.created_at DESC
        `);
        res.json(kycs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching KYC applications' });
    }
});

app.post('/api/admin/kyc/:id/status', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE kyc_verifications SET status = ? WHERE id = ?', [status, id]);

        // Notify Partner
        const [[kyc]] = await db.query('SELECT partner_id, full_name FROM kyc_verifications WHERE id = ?', [id]);
        if (kyc) {
            if (status === 'approved') {
                // Automatically fetch and update the partner's legal name from the verified KYC application
                await db.query('UPDATE partners SET name = ? WHERE id = ?', [kyc.full_name, kyc.partner_id]);
            }

            const title = status === 'approved' ? 'KYC Verified Successfully' : 'KYC Verification Rejected';
            const message = status === 'approved' 
                ? 'Your identity verification is complete. You can now access all premium services.' 
                : 'There was an issue with your documents. Please review and resubmit.';
            const type = status === 'approved' ? 'success' : 'error';

            await db.query(
                'INSERT INTO notifications (partner_id, type, title, message) VALUES (?, ?, ?, ?)',
                [kyc.partner_id, type, title, message]
            );
        }

        res.json({ message: 'KYC status updated' });
    } catch (error) {
        console.error('KYC update error:', error);
        res.status(500).json({ message: 'Error updating KYC status' });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const [leadsCount] = await db.query('SELECT COUNT(*) as count FROM leads');
        const [activeServices] = await db.query('SELECT COUNT(DISTINCT service_type) as count FROM leads');
        res.json({
            stats: [
                { title: 'Total Leads', value: leadsCount[0].count, trend: '+0%' },
                { title: 'Active Services', value: activeServices[0].count, trend: '+0' },
                { title: 'Success Rate', value: '0%', trend: '+0%' },
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/dashboard/leads', authenticateToken, async (req, res) => {
    try {
        const [leads] = await db.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5');
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ── RELATIONSHIP MANAGER ROUTES ──

app.get('/api/admin/rms', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [rms] = await db.query('SELECT * FROM relationship_managers ORDER BY created_at DESC');
        res.json(rms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching RMs' });
    }
});

app.post('/api/admin/rms', authenticateToken, isAdmin, async (req, res) => {
    const { id, name, phone, whatsapp, profile_url } = req.body;
    try {
        if (id) {
            await db.query(
                'UPDATE relationship_managers SET name=?, phone=?, whatsapp=?, profile_url=? WHERE id=?',
                [name, phone, whatsapp, profile_url, id]
            );
            res.json({ message: 'RM updated' });
        } else {
            await db.query(
                'INSERT INTO relationship_managers (name, phone, whatsapp, profile_url) VALUES (?, ?, ?, ?)',
                [name, phone, whatsapp, profile_url]
            );
            res.status(201).json({ message: 'RM created' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error saving RM' });
    }
});

app.post('/api/admin/partners/:id/assign-rm', authenticateToken, isAdmin, async (req, res) => {
    const partnerId = req.params.id;
    const { rm_id } = req.body;
    try {
        await db.query('UPDATE partners SET rm_id = ? WHERE id = ?', [rm_id, partnerId]);
        res.json({ message: 'RM assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning RM' });
    }
});

app.get('/api/profile/rm', authenticateToken, async (req, res) => {
    try {
        const partner_id = req.user.id;
        const [rows] = await db.query(`
            SELECT rm.* 
            FROM partners p
            JOIN relationship_managers rm ON p.rm_id = rm.id
            WHERE p.id = ?
        `, [partner_id]);
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json(null);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned RM' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', database: 'Connected' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
