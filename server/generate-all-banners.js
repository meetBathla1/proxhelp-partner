const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const BANNERS_DIR = path.join(__dirname, '..', 'client', 'public', 'banners', 'share');

// Color themes per category
const themes = {
  credit_card:   { bg1: '#002d62', bg2: '#001842', bg3: '#0a3a7a', accent: '#ff8c00', accent2: '#ffa833', bar: '#ffd700' },
  fd_card:       { bg1: '#1a1a2e', bg2: '#16213e', bg3: '#0f3460', accent: '#e94560', accent2: '#ff6b6b', bar: '#e94560' },
  instant_loan:  { bg1: '#2d1b69', bg2: '#1a0a3e', bg3: '#4a2c8a', accent: '#00d4ff', accent2: '#7ef9ff', bar: '#00d4ff' },
  personal_loan: { bg1: '#004d40', bg2: '#00251a', bg3: '#00695c', accent: '#ffd740', accent2: '#ffecb3', bar: '#ffd740' },
  business_loan: { bg1: '#1b3a2d', bg2: '#0d2818', bg3: '#2e7d52', accent: '#f9a825', accent2: '#fdd835', bar: '#f9a825' },
  micro_loan:    { bg1: '#311b92', bg2: '#1a0066', bg3: '#4a148c', accent: '#ff80ab', accent2: '#ff4081', bar: '#ff80ab' },
  group_loan:    { bg1: '#4a1010', bg2: '#2c0606', bg3: '#7f1d1d', accent: '#fbbf24', accent2: '#f59e0b', bar: '#fbbf24' },
  savings:       { bg1: '#0d4f3c', bg2: '#063328', bg3: '#15803d', accent: '#34d399', accent2: '#6ee7b7', bar: '#34d399' },
  demat:         { bg1: '#1e1b4b', bg2: '#0f0a30', bg3: '#3730a3', accent: '#a78bfa', accent2: '#c4b5fd', bar: '#a78bfa' },
  insurance:     { bg1: '#0c4a6e', bg2: '#082f49', bg3: '#0369a1', accent: '#38bdf8', accent2: '#7dd3fc', bar: '#38bdf8' },
};

const products = [
  { id: 4, name: 'AU Bank Altura Plus', bank: 'AU Bank', theme: 'credit_card', category: 'Credit Card',
    badge: 'REWARDS CARD', benefits: [{ val: '1.5%', label: 'REWARD POINTS' }, { val: 'B1G1', label: 'MOVIE TICKETS' }, { val: '₹0', label: 'JOINING FEE' }],
    desc: 'Earn 1.5% reward points on every spend and enjoy Buy 1 Get 1 movie tickets with AU Bank Altura Plus!' },

  { id: 5, name: 'Stable Money FD Card', bank: 'Stable Money', theme: 'fd_card', category: 'FD Credit Card',
    badge: 'FD-BACKED CARD', benefits: [{ val: '9%+', label: 'FD RETURNS' }, { val: '100%', label: 'DIGITAL' }, { val: 'HIGH', label: 'APPROVAL RATE' }],
    desc: 'Get higher FD returns than bank average with an FD-backed credit card. 100% digital process!' },

  { id: 6, name: 'SBM ZET FD Credit Card', bank: 'SBM Bank', theme: 'fd_card', category: 'FD Credit Card',
    badge: 'BUILD YOUR CIBIL', benefits: [{ val: '₹2K', label: 'MIN FD AMOUNT' }, { val: 'NO', label: 'INCOME PROOF' }, { val: 'CIBIL', label: 'SCORE BUILDER' }],
    desc: 'Start your credit journey with just ₹2000 FD! No income proof needed. Build your CIBIL score easily.' },

  { id: 10, name: 'KreditBee Instant Loan', bank: 'KreditBee', theme: 'instant_loan', category: 'Instant Loan',
    badge: 'INSTANT APPROVAL', benefits: [{ val: '10', label: 'MINS DISBURSAL' }, { val: '₹4L', label: 'MAX AMOUNT' }, { val: '100%', label: 'ONLINE' }],
    desc: 'Get loan in just 10 minutes! Up to ₹4 Lakhs with 100% online process. Quick and hassle-free.' },

  { id: 11, name: 'Fibe (EarlySalary)', bank: 'Fibe', theme: 'instant_loan', category: 'Instant Loan',
    badge: 'SALARY ADVANCE', benefits: [{ val: '₹5L', label: 'CREDIT LIMIT' }, { val: 'FAST', label: 'APPROVAL' }, { val: 'FLEX', label: 'REPAYMENT' }],
    desc: 'Instant approval for salaried professionals! Credit limit up to ₹5 Lakhs with flexible repayment options.' },

  { id: 7, name: 'IndusInd Bank Personal Loan', bank: 'IndusInd Bank', theme: 'personal_loan', category: 'Personal Loan',
    badge: 'DIGITAL LOAN', benefits: [{ val: 'FAST', label: 'DISBURSAL' }, { val: 'NO', label: 'COLLATERAL' }, { val: 'LOW', label: 'INTEREST' }],
    desc: 'Quick digital approval with fast disbursal! No collateral required. Get funds at attractive interest rates.' },

  { id: 8, name: 'Unity Personal Loan', bank: 'Unity Bank', theme: 'personal_loan', category: 'Personal Loan',
    badge: '2-MIN APPROVAL', benefits: [{ val: '2', label: 'MIN APPROVAL' }, { val: 'NO', label: 'INCOME PROOF' }, { val: '100%', label: 'DIGITAL' }],
    desc: 'Get approved in just 2 minutes! No income proof required. Completely digital and hassle-free process.' },

  { id: 9, name: 'Tata Capital Personal Loan', bank: 'Tata Capital', theme: 'personal_loan', category: 'Personal Loan',
    badge: 'TRUSTED BRAND', benefits: [{ val: '₹35L', label: 'MAX AMOUNT' }, { val: 'QUICK', label: 'APPROVAL' }, { val: '100%', label: 'DIGITAL' }],
    desc: 'Loans up to ₹35 Lakhs from the trusted Tata brand. Quick approval and 100% digital process!' },

  { id: 17, name: 'Lendingkart Business Loan', bank: 'Lendingkart', theme: 'business_loan', category: 'Business Loan',
    badge: 'GROW YOUR BUSINESS', benefits: [{ val: '24H', label: 'APPROVAL' }, { val: 'MIN', label: 'DOCUMENTS' }, { val: 'NO', label: 'COLLATERAL' }],
    desc: 'Unsecured business loans with approval in 24 hours! Minimal documentation and no collateral needed.' },

  { id: 18, name: 'Ziploan Quick Business Loan', bank: 'Ziploan', theme: 'business_loan', category: 'Business Loan',
    badge: 'QUICK FUNDING', benefits: [{ val: '₹7.5L', label: 'MAX LOAN' }, { val: '12-36', label: 'MONTH TENURE' }, { val: 'FAST', label: 'PROCESSING' }],
    desc: 'Business loan up to ₹7.5 Lakhs with flexible tenure of 12-36 months. Quick digital processing!' },

  { id: 19, name: 'Fusion Microfinance Loan', bank: 'Fusion Microfinance', theme: 'micro_loan', category: 'Micro Loan',
    badge: 'WOMEN EMPOWERMENT', benefits: [{ val: 'LOW', label: 'TICKET SIZE' }, { val: 'EASY', label: 'GROUP LENDING' }, { val: 'WOMEN', label: 'FOCUSED' }],
    desc: 'Empowering women entrepreneurs with easy group-based micro loans. Small ticket sizes, big impact!' },

  { id: 20, name: 'Annapurna Finance Micro Loan', bank: 'Annapurna Finance', theme: 'micro_loan', category: 'Micro Loan',
    badge: 'RURAL DEVELOPMENT', benefits: [{ val: 'RURAL', label: 'FOCUSED' }, { val: 'AGRI', label: 'SUPPORT' }, { val: 'TRUST', label: 'BY MILLIONS' }],
    desc: 'Supporting rural livelihoods and agriculture. Trusted by millions across India for micro-financing.' },

  { id: 21, name: 'Muthoot Microfin Group Loan', bank: 'Muthoot Microfin', theme: 'group_loan', category: 'Group Loan',
    badge: 'COMMUNITY LENDING', benefits: [{ val: 'LOW', label: 'INTEREST' }, { val: 'EASY', label: 'DOCUMENTATION' }, { val: 'GROUP', label: 'BASED' }],
    desc: 'Community-based group lending with low interest rates and hassle-free documentation from Muthoot!' },

  { id: 22, name: 'L&T Finance Group Loan', bank: 'L&T Finance', theme: 'group_loan', category: 'Group Loan',
    badge: 'INSTITUTIONAL TRUST', benefits: [{ val: 'STRONG', label: 'BACKING' }, { val: 'CLEAR', label: 'PROCESS' }, { val: 'APP', label: 'MANAGED' }],
    desc: 'Strong institutional backing from L&T with transparent processes. Manage everything via mobile app!' },

  { id: 12, name: 'Kotak 811 Savings Account', bank: 'Kotak Mahindra Bank', theme: 'savings', category: 'Savings Account',
    badge: 'ZERO BALANCE ACCOUNT', benefits: [{ val: '₹0', label: 'MIN BALANCE' }, { val: '4%', label: 'INTEREST P.A.' }, { val: 'VIDEO', label: 'KYC INSTANT' }],
    desc: 'Open a Zero Balance Savings Account instantly! Earn up to 4% interest with instant Video KYC.' },

  { id: 13, name: 'AU Digital Savings Account', bank: 'AU Small Finance Bank', theme: 'savings', category: 'Savings Account',
    badge: 'HIGH INTEREST SAVINGS', benefits: [{ val: 'HIGH', label: 'INTEREST' }, { val: 'FREE', label: 'DEBIT CARD' }, { val: '100%', label: 'PAPERLESS' }],
    desc: 'Monthly interest payout with high-limit debit card! 100% paperless onboarding with AU Small Finance Bank.' },

  { id: 14, name: 'Upstox Demat Account', bank: 'Upstox', theme: 'demat', category: 'Demat Account',
    badge: 'START INVESTING', benefits: [{ val: '₹0', label: 'MF BROKERAGE' }, { val: '5', label: 'MIN SETUP' }, { val: 'EASY', label: 'TRADING APP' }],
    desc: 'Zero brokerage on Mutual Funds! Open your Demat account in just 5 minutes with Upstox.' },

  { id: 15, name: 'm.Stock by Mirae Asset', bank: 'm.Stock', theme: 'demat', category: 'Demat Account',
    badge: 'LIFETIME FREE TRADING', benefits: [{ val: '₹0', label: 'LIFETIME FEE' }, { val: 'PRO', label: 'CHARTS' }, { val: 'SAFE', label: 'AND TRUSTED' }],
    desc: 'Lifetime zero brokerage with advanced charting tools! Secure and trusted by Mirae Asset.' },

  { id: 16, name: 'HDFC ERGO Health Insurance', bank: 'HDFC ERGO', theme: 'insurance', category: 'Health Insurance',
    badge: 'PROTECT YOUR FAMILY', benefits: [{ val: 'CASHLESS', label: 'TREATMENT' }, { val: '80D', label: 'TAX BENEFIT' }, { val: '24/7', label: 'AMBULANCE' }],
    desc: 'Cashless treatment at network hospitals! Get tax benefits under Section 80D with emergency ambulance cover.' },
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSVG(product) {
  const t = themes[product.theme];
  const b = product.benefits;
  
  // Split product name into lines (max ~20 chars per line)
  const words = product.name.split(' ');
  let lines = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > 22 && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = (currentLine + ' ' + word).trim();
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  
  // If name fits in 1-2 lines, use larger font
  const fontSize = lines.length <= 2 ? 38 : 30;
  const lineHeight = lines.length <= 2 ? 48 : 40;
  const titleStartY = lines.length <= 2 ? 215 : 200;

  const titleLines = lines.map((line, i) => {
    // Color the bank name in accent
    const bankWords = product.bank.split(' ');
    let colored = escapeXml(line);
    for (const bw of bankWords) {
      if (line.includes(bw) && bw.length > 2) {
        colored = colored.replace(escapeXml(bw), `</tspan><tspan fill="${t.accent}">${escapeXml(bw)}</tspan><tspan fill="white">`);
      }
    }
    return `  <text x="400" y="${titleStartY + i * lineHeight}" font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" font-weight="900" fill="white" text-anchor="middle"><tspan fill="white">${colored}</tspan></text>`;
  }).join('\n');

  const subtitleY = titleStartY + lines.length * lineHeight + 10;
  const chipsY = subtitleY + 40;
  const ctaY = chipsY + 108;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg1}"/>
      <stop offset="40%" style="stop-color:${t.bg2}"/>
      <stop offset="70%" style="stop-color:${t.bg3}"/>
      <stop offset="100%" style="stop-color:${t.bg1}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.accent}"/>
      <stop offset="100%" style="stop-color:${t.accent2}"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${t.accent}"/>
      <stop offset="50%" style="stop-color:${t.bar}"/>
      <stop offset="100%" style="stop-color:${t.accent}"/>
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bg)"/>

  <!-- Decorative -->
  <circle cx="740" cy="0" r="180" fill="${t.accent}" opacity="0.06"/>
  <circle cx="60" cy="600" r="200" fill="${t.accent}" opacity="0.04"/>
  <circle cx="400" cy="300" r="280" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <circle cx="400" cy="300" r="200" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
  <circle cx="120" cy="100" r="3" fill="${t.accent}" opacity="0.5"/>
  <circle cx="680" cy="150" r="2" fill="${t.accent}" opacity="0.4"/>
  <circle cx="200" cy="480" r="2.5" fill="rgba(255,255,255,0.2)"/>

  <!-- Branding -->
  <text x="30" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" fill="rgba(255,255,255,0.18)" letter-spacing="3">FINEXPRT</text>
  <text x="770" y="36" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" text-anchor="end" letter-spacing="1">Powered by ${escapeXml(product.bank)}</text>

  <!-- Badge -->
  <rect x="${400 - (product.badge.length * 5 + 30)}" y="120" width="${product.badge.length * 10 + 60}" height="30" rx="15" fill="url(#accent)"/>
  <text x="400" y="140" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="700" fill="white" text-anchor="middle" letter-spacing="1.5">⭐ ${escapeXml(product.badge)}</text>

  <!-- Title -->
${titleLines}

  <!-- Subtitle -->
  <text x="400" y="${subtitleY}" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.55)" text-anchor="middle">Exclusive Partner Offer · Apply Today</text>

  <!-- Benefit Chips -->
  <rect x="120" y="${chipsY}" width="160" height="85" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="200" y="${chipsY + 38}" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="900" fill="${t.accent}" text-anchor="middle">${escapeXml(b[0].val)}</text>
  <text x="200" y="${chipsY + 62}" font-family="Segoe UI, Arial, sans-serif" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="1.5">${escapeXml(b[0].label)}</text>

  <rect x="310" y="${chipsY}" width="160" height="85" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="390" y="${chipsY + 38}" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="900" fill="${t.accent}" text-anchor="middle">${escapeXml(b[1].val)}</text>
  <text x="390" y="${chipsY + 62}" font-family="Segoe UI, Arial, sans-serif" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="1.5">${escapeXml(b[1].label)}</text>

  <rect x="500" y="${chipsY}" width="160" height="85" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="580" y="${chipsY + 38}" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="900" fill="${t.accent}" text-anchor="middle">${escapeXml(b[2].val)}</text>
  <text x="580" y="${chipsY + 62}" font-family="Segoe UI, Arial, sans-serif" font-size="9" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="1.5">${escapeXml(b[2].label)}</text>

  <!-- CTA -->
  <rect x="290" y="${ctaY}" width="180" height="44" rx="22" fill="url(#accent)"/>
  <text x="380" y="${ctaY + 28}" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" fill="white" text-anchor="middle">Apply Now →</text>

  <text x="500" y="${ctaY + 28}" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="rgba(255,255,255,0.35)">via Finexprt Partner</text>

  <!-- Bottom bar -->
  <rect x="0" y="595" width="800" height="5" fill="url(#bar)"/>
</svg>`;
}

async function main() {
  // Create directory
  if (!fs.existsSync(BANNERS_DIR)) {
    fs.mkdirSync(BANNERS_DIR, { recursive: true });
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  for (const product of products) {
    const filename = `product-${product.id}.svg`;
    const filepath = path.join(BANNERS_DIR, filename);
    const dbPath = `/banners/share/${filename}`;

    // Generate and write SVG
    const svg = generateSVG(product);
    fs.writeFileSync(filepath, svg);
    console.log(`✅ Created banner: ${filename}`);

    // Update database
    await connection.query(
      'UPDATE products SET share_image_url = ?, share_description = ? WHERE id = ?',
      [dbPath, product.desc, product.id]
    );
    console.log(`   DB updated for product ID ${product.id}`);
  }

  // Also update the existing HDFC card (ID 3) to use the share subfolder path
  await connection.query(
    "UPDATE products SET share_image_url = '/banners/hdfc-swiggy-share.svg' WHERE id = 3"
  );
  console.log(`✅ Confirmed HDFC (ID 3) banner path`);

  await connection.end();
  console.log('\n🎉 All banners created and database updated!');
}

main().catch(console.error);
