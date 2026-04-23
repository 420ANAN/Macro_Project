const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkProducts() {
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'Root@1234',
        database: process.env.MYSQL_DATABASE || 'maco'
    });

    try {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products');
        console.log(`Current products count: ${rows[0].count}`);
        
        if (rows[0].count === 0) {
            console.log('No products found. Inserting samples...');
            
            // Insert categories first
            const categories = ['Engine Parts', 'Suspension', 'Electrical', 'Body Parts'];
            for (const cat of categories) {
                await pool.execute('INSERT IGNORE INTO product_categories (name) VALUES (?)', [cat]);
            }
            
            const [catRows] = await pool.execute('SELECT id, name FROM product_categories');
            const catMap = catRows.reduce((acc, row) => ({ ...acc, [row.name]: row.id }), {});
            
            const samples = [
                { name: 'Piston Kit - Standard', category: 'Engine Parts', rate: 1250, uom: 'SET', desc: 'High precision piston kit for heavy duty engines.' },
                { name: 'Shock Absorber Front', category: 'Suspension', rate: 2100, uom: 'PCS', desc: 'Premium gas-charged shock absorber.' },
                { name: 'Alternator Assembly', category: 'Electrical', rate: 4500, uom: 'PCS', desc: '12V 90A High output alternator.' },
                { name: 'Brake Pad Set', category: 'Suspension', rate: 850, uom: 'SET', desc: 'Ceramic brake pads for long life.' },
                { name: 'LED Headlight Bulb', category: 'Electrical', rate: 1200, uom: 'PAIR', desc: 'Super bright 6000K LED bulbs.' },
                { name: 'Oil Filter', category: 'Engine Parts', rate: 350, uom: 'PCS', desc: 'Synthetic media high efficiency oil filter.' },
                { name: 'Air Filter Element', category: 'Engine Parts', rate: 450, uom: 'PCS', desc: 'High flow air filter for better performance.' },
                { name: 'Clutch Plate', category: 'Engine Parts', rate: 3200, uom: 'PCS', desc: 'Heavy duty friction material clutch plate.' },
                { name: 'Tie Rod End', category: 'Suspension', rate: 650, uom: 'PCS', desc: 'Forged steel tie rod end for precision steering.' },
                { name: 'Wiper Blade 20"', category: 'Body Parts', rate: 250, uom: 'PCS', desc: 'Silicone rubber wiper blade for clear vision.' }
            ];
            
            for (const s of samples) {
                await pool.execute(
                    'INSERT INTO products (name, category_id, description, uom, rate, supplier_name, location, experience_years) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [s.name, catMap[s.category], s.desc, s.uom, s.rate, 'Maco Automotive', 'New Delhi', 15]
                );
            }
            console.log('Sample products inserted.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkProducts();
