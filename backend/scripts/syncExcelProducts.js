const XLSX = require('xlsx');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maco_erp'
});

async function syncExcel() {
    try {
        const filePath = path.join(__dirname, '../products.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Read ${data.length} products from Excel.`);

        for (const row of data) {
            const { Name, Category, Description, UOM, Rate, ImageURL } = row;
            
            // 1. Get/Create Category
            let [catRows] = await pool.execute('SELECT id FROM product_categories WHERE name = ?', [Category]);
            let categoryId;
            if (catRows.length === 0) {
                const [insCat] = await pool.execute('INSERT INTO product_categories (name) VALUES (?)', [Category]);
                categoryId = insCat.insertId;
            } else {
                categoryId = catRows[0].id;
            }

            // 2. Upsert Product
            const [existing] = await pool.execute('SELECT id FROM products WHERE name = ?', [Name]);
            if (existing.length > 0) {
                await pool.execute(
                    'UPDATE products SET category_id = ?, description = ?, uom = ?, rate = ?, image_url = ? WHERE id = ?',
                    [categoryId, Description || '', UOM || 'PCS', Rate || 0, ImageURL || '', existing[0].id]
                );
            } else {
                await pool.execute(
                    'INSERT INTO products (name, category_id, description, uom, rate, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                    [Name, categoryId, Description || '', UOM || 'PCS', Rate || 0, ImageURL || '']
                );
            }
        }

        console.log('✅ Product sync complete!');
    } catch (err) {
        console.error('❌ Sync failed:', err.message);
    } finally {
        await pool.end();
    }
}

syncExcel();
