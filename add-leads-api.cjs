const fs = require('fs');
const filePath = 'server/index.js';
let content = fs.readFileSync(filePath, 'utf8');

const leadsApiStr = `
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
`;

if (!content.includes("app.get('/api/leads'")) {
    content = content.replace('// ── ADMIN MANAGEMENT ROUTES ──', leadsApiStr + '\n\n// ── ADMIN MANAGEMENT ROUTES ──');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Endpoints added');
} else {
    console.log('Endpoints already exist');
}
