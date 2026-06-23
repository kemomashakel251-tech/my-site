import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  try {
    console.log('Initializing database schema...');
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the SQL schema
    await db.exec(schemaSql);
    console.log('Schema loaded successfully.');

    // 1. Seed Default Admin User
    const adminUsername = 'admin';
    const adminEmail = 'admin@yourplace.com';
    const adminPassword = 'AdminPlace2026!'; // كلمة المرور الخاصة بك

    const existingAdmin = await db.get(`SELECT id FROM users WHERE username = ?`, [adminUsername]);
    if (!existingAdmin) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(adminPassword, salt);

        await db.run(
          `INSERT INTO users (username, password_hash, password_salt, email, role, full_name, status) VALUES (?,?,?,?,?,?,?)`,
          [adminUsername, hash, salt, adminEmail, 'admin', 'مدير النظام (Admin)', 'active']
        );
        console.log('Default Administrator Created Successfully!');
        console.log('Username:', adminUsername);
        console.log('Password:', adminPassword);
    } else {
        console.log('Admin user already exists.');
    }

    // 2. Seed General Settings
    console.log('Seeding default settings...');
    const defaultSettings = [
      { key: 'store_name_ar', value: 'مكانك - Your Place' },
      { key: 'store_name_en', value: 'Your Place' },
      { key: 'whatsapp_number', value: '201000000000' }, 
      { key: 'currency_ar', value: 'جنيه' },
      { key: 'currency_en', value: 'EGP' }
    ];

    for (const setting of defaultSettings) {
      const exists = await db.get('SELECT key FROM settings WHERE key = ?', [setting.key]);
      if (!exists) {
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [setting.key, setting.value]);
      }
    }

    // 3. Seed Sample Categories
    console.log('Seeding sample categories...');
    const sampleCategories = [
      { name_ar: 'إلكترونيات', name_en: 'Electronics', slug: 'electronics', desc_ar: 'أجهزة ذكية وإلكترونيات استهلاكية', desc_en: 'Smart devices and consumer electronics' },
      { name_ar: 'ملابس وأزياء', name_en: 'Fashion & Clothing', slug: 'fashion', desc_ar: 'ملابس عصرية تناسب جميع الأذواق', desc_en: 'Modern clothes for all tastes' },
      { name_ar: 'مستحضرات تجميل', name_en: 'Cosmetics', slug: 'cosmetics', desc_ar: 'منتجات عناية بالبشرة ومستحضرات تجميل أصلية', desc_en: 'Original skincare and cosmetic products' }
    ];

    for (const cat of sampleCategories) {
      const exists = await db.get('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      if (!exists) {
        await db.run(
          'INSERT INTO categories (name_ar, name_en, slug, description_ar, description_en) VALUES (?, ?, ?, ?, ?)',
          [cat.name_ar, cat.name_en, cat.slug, cat.desc_ar, cat.desc_en]
        );
      }
    }

    // Get category IDs for product seeding
    const electronicsCat = await db.get("SELECT id FROM categories WHERE slug = 'electronics'");
    const fashionCat = await db.get("SELECT id FROM categories WHERE slug = 'fashion'");

    // 4. Seed Sample Products
    console.log('Seeding sample products...');
    const sampleProducts = [
      {
        name_ar: 'سماعات بلوتوث برو لاسلكية',
        name_en: 'Bluetooth Pro Wireless Headphones',
        description_ar: 'سماعات رأس لاسلكية عالية الدقة مع خاصية إلغاء الضوضاء النشطة، صوت محيطي مجسم وبطارية تدوم حتى 40 ساعة متواصلة.',
        description_en: 'High-definition wireless headphones with active noise cancellation, stereo surround sound, and battery lasting up to 40 hours continuous.',
        price: 1500.00,
        compare_at_price: 2000.00,
        category_id: electronicsCat?.id || 1,
        stock: 15,
        min_stock_alert: 5,
        sku: 'ELEC-HEAD-001',
        image_url: '/uploads/sample-headphone.jpg',
        status: 'active'
      },
      {
        name_ar: 'ساعة ذكية رياضية بلس',
        name_en: 'Sports Smartwatch Plus',
        description_ar: 'ساعة ذكية مقاومة للماء تدعم مراقبة ضربات القلب، تتبع النوم، قياس الأكسجين، مع شاشة أموليد ملونة وتلقي إشعارات الهاتف.',
        description_en: 'Waterproof smartwatch supporting heart rate monitoring, sleep tracking, oxygen measurement, with AMOLED color display and phone notifications.',
        price: 2200.00,
        compare_at_price: 3000.00,
        category_id: electronicsCat?.id || 1,
        stock: 3, 
        min_stock_alert: 5,
        sku: 'ELEC-WATCH-002',
        image_url: '/uploads/sample-watch.jpg',
        status: 'active'
      },
      {
        name_ar: 'جاكيت جلدي كلاسيكي فاخر',
        name_en: 'Premium Classic Leather Jacket',
        description_ar: 'جاكيت رجالي مصنوع من الجلد الطبيعي 100% بتصميم عصري وأنيق، مناسب لفصل الشتاء ويوفر دفئاً ممتازاً مع بطانة داخلية ناعمة.',
        description_en: 'Men jacket made of 100% natural leather with modern stylish design, suitable for winter, providing excellent warmth with soft lining.',
        price: 3500.00,
        compare_at_price: 4500.00,
        category_id: fashionCat?.id || 2,
        stock: 8,
        min_stock_alert: 3,
        sku: 'FASH-JACK-003',
        image_url: '/uploads/sample-jacket.jpg',
        status: 'active'
      }
    ];

    for (const prod of sampleProducts) {
      const exists = await db.get('SELECT id FROM products WHERE sku = ?', [prod.sku]);
      if (!exists) {
        await db.run(
          `INSERT INTO products (name_ar, name_en, description_ar, description_en, price, compare_at_price, category_id, stock, min_stock_alert, sku, image_url, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [prod.name_ar, prod.name_en, prod.description_ar, prod.description_en, prod.price, prod.compare_at_price, prod.category_id, prod.stock, prod.min_stock_alert, prod.sku, prod.image_url, prod.status]
        );
      }
    }

    console.log('Database seeding completed successfully.');
    await db.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();