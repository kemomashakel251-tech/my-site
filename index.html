import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { authenticateToken, authorizeRoles, JWT_SECRET } from './middleware/auth.js';
import { apiLimiter, loginLimiter, sanitizeInput, uploadProductImage } from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Security & Configuration Middleware
// ==========================================

// Enable CORS
app.use(cors({
  origin: '*', // In production, replace with specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable Helmet for security headers and XSS/CSP protection
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows serving images to frontend
  contentSecurityPolicy: false // Allows easy local development
}));

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize inputs recursively to protect against XSS
app.use(sanitizeInput);

// Apply general API rate limiter to all api routes
app.use('/api/', apiLimiter);

// Serve uploaded product images statically (No-exec execution prevention)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. Authentication & Staff Management APIs
// ==========================================

// Login endpoint (with brute force protection)
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter username and password / يرجى إدخال اسم المستخدم وكلمة المرور' });
  }

  try {
    // Parameterized query to prevent SQL Injection
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      // Log failed login attempt
      await db.run(
        `INSERT INTO audit_logs (action, details, ip_address, user_agent, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['LOGIN_FAILED', `Failed login attempt for non-existent username: ${username}`, ip, userAgent, 'failed']
      );
      return res.status(401).json({ message: 'Invalid username or password / اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account is suspended / هذا الحساب غير نشط حالياً' });
    }

    // Verify Password
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      // Log failed login attempt for audit
      await db.run(
        `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, 'LOGIN_FAILED', `Failed login attempt for user: ${username}`, ip, userAgent, 'failed']
      );
      return res.status(401).json({ message: 'Invalid username or password / اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Log successful login
    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, 'LOGIN_SUCCESS', `User '${username}' logged in successfully`, ip, userAgent, 'success']
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error / حدث خطأ في الخادم' });
  }
});

// Get current profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, username, email, role, full_name, status FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found / المستخدم غير موجود' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Users/Staff CRUD (Admin Only)
app.get('/api/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await db.all('SELECT id, username, email, role, full_name, status, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { username, password, email, role, full_name } = req.body;
  if (!username || !password || !email || !role || !full_name) {
    return res.status(400).json({ message: 'All fields are required / جميع الحقول مطلوبة' });
  }

  try {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);

    const result = await db.run(
      `INSERT INTO users (username, password_hash, password_salt, email, role, full_name, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [username, hash, salt, email, role, full_name]
    );

    // Audit log
    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?, 'success')`,
      [req.user.id, 'USER_CREATED', `Created new user: ${username} with role: ${role}`, req.ip, req.headers['user-agent']]
    );

    res.status(201).json({ id: result.lastID, username, email, role, full_name });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Username or email already exists / اسم المستخدم أو البريد الإلكتروني موجود بالفعل' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { full_name, email, role, status, password } = req.body;
  const { id } = req.params;

  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let query = 'UPDATE users SET full_name = ?, email = ?, role = ?, status = ?';
    let params = [full_name || user.full_name, email || user.email, role || user.role, status || user.status];

    if (password) {
      const salt = bcrypt.genSaltSync(12);
      const hash = bcrypt.hashSync(password, salt);
      query += ', password_hash = ?, password_salt = ?';
      params.push(hash, salt);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.run(query, params);

    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?, 'success')`,
      [req.user.id, 'USER_UPDATED', `Updated user: ${user.username} (ID: ${id})`, req.ip, req.headers['user-agent']]
    );

    res.json({ message: 'User updated successfully / تم تحديث بيانات الموظف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account / لا يمكنك حذف حسابك الشخصي' });
  }

  try {
    const user = await db.get('SELECT username FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.run('DELETE FROM users WHERE id = ?', [id]);

    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?, 'success')`,
      [req.user.id, 'USER_DELETED', `Deleted user: ${user.username} (ID: ${id})`, req.ip, req.headers['user-agent']]
    );

    res.json({ message: 'User deleted successfully / تم حذف الموظف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. Category Management APIs
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.all('SELECT * FROM categories ORDER BY id DESC');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/categories', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  const { name_ar, name_en, slug, description_ar, description_en } = req.body;
  if (!name_ar || !name_en || !slug) {
    return res.status(400).json({ message: 'Name and slug are required / الاسم والرابط الفريد مطلوبين' });
  }

  try {
    const result = await db.run(
      'INSERT INTO categories (name_ar, name_en, slug, description_ar, description_en) VALUES (?, ?, ?, ?, ?)',
      [name_ar, name_en, slug.toLowerCase(), description_ar, description_en]
    );
    res.status(201).json({ id: result.lastID, name_ar, name_en, slug });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Category slug already exists / الرابط الفريد للتصنيف موجود بالفعل' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/categories/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  const { name_ar, name_en, slug, description_ar, description_en } = req.body;
  const { id } = req.params;

  try {
    await db.run(
      'UPDATE categories SET name_ar = ?, name_en = ?, slug = ?, description_ar = ?, description_en = ? WHERE id = ?',
      [name_ar, name_en, slug.toLowerCase(), description_ar, description_en, id]
    );
    res.json({ message: 'Category updated successfully / تم تحديث التصنيف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/categories/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully / تم حذف التصنيف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. Product Management APIs
// ==========================================

// Get all products (Public & Dashboard)
app.get('/api/products', async (req, res) => {
  const { category, status } = req.query;
  let query = `
    SELECT p.*, c.name_ar as category_name_ar, c.name_en as category_name_en 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  let params = [];
  let conditions = [];

  if (category) {
    conditions.push('p.category_id = ?');
    params.push(category);
  }
  if (status) {
    conditions.push('p.status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY p.id DESC';

  try {
    const products = await db.all(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.get(
      `SELECT p.*, c.name_ar as category_name_ar, c.name_en as category_name_en 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`, 
      [req.params.id]
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found / المنتج غير موجود' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new product (with Multer file upload)
app.post('/api/products', authenticateToken, authorizeRoles('admin', 'manager'), uploadProductImage.single('image'), async (req, res) => {
  const { name_ar, name_en, description_ar, description_en, price, compare_at_price, category_id, stock, min_stock_alert, sku, status } = req.body;
  
  if (!name_ar || !name_en || !price || !stock) {
    return res.status(400).json({ message: 'Name, price and stock are required / الحقول الأساسية مطلوبة' });
  }

  // Get image path if uploaded
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const result = await db.run(
      `INSERT INTO products (name_ar, name_en, description_ar, description_en, price, compare_at_price, category_id, stock, min_stock_alert, sku, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name_ar, 
        name_en, 
        description_ar, 
        description_en, 
        parseFloat(price), 
        compare_at_price ? parseFloat(compare_at_price) : null,
        category_id ? parseInt(category_id) : null,
        parseInt(stock),
        min_stock_alert ? parseInt(min_stock_alert) : 5,
        sku || null,
        imageUrl,
        status || 'active'
      ]
    );

    res.status(201).json({ id: result.lastID, message: 'Product created successfully / تم إضافة المنتج بنجاح' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'SKU already exists / الرمز SKU موجود بالفعل' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update product (with optional file upload)
app.put('/api/products/:id', authenticateToken, authorizeRoles('admin', 'manager'), uploadProductImage.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name_ar, name_en, description_ar, description_en, price, compare_at_price, category_id, stock, min_stock_alert, sku, status } = req.body;

  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found / المنتج غير موجود' });
    }

    let imageUrl = product.image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Note: In production, delete old image file from server to save space
    }

    await db.run(
      `UPDATE products 
       SET name_ar = ?, name_en = ?, description_ar = ?, description_en = ?, price = ?, compare_at_price = ?, category_id = ?, stock = ?, min_stock_alert = ?, sku = ?, image_url = ?, status = ?
       WHERE id = ?`,
      [
        name_ar || product.name_ar,
        name_en || product.name_en,
        description_ar || product.description_ar,
        description_en || product.description_en,
        price ? parseFloat(price) : product.price,
        compare_at_price ? parseFloat(compare_at_price) : product.compare_at_price,
        category_id ? parseInt(category_id) : product.category_id,
        stock ? parseInt(stock) : product.stock,
        min_stock_alert ? parseInt(min_stock_alert) : product.min_stock_alert,
        sku || product.sku,
        imageUrl,
        status || product.status,
        id
      ]
    );

    res.json({ message: 'Product updated successfully / تم تحديث المنتج بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully / تم حذف المنتج بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 5. Order Management APIs
// ==========================================

// Get all orders (Admin/Manager/Staff)
app.get('/api/orders', authenticateToken, authorizeRoles('admin', 'manager', 'staff'), async (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM orders';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY id DESC';

  try {
    const orders = await db.all(query, params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order with details
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found / الطلب غير موجود' });
    }

    const items = await db.all(
      `SELECT oi.*, p.name_ar, p.name_en, p.sku, p.image_url 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track order (Public tracking endpoint)
app.get('/api/orders/track/:code', async (req, res) => {
  try {
    const order = await db.get('SELECT id, order_number, status, subtotal, shipping_fee, total_amount, discount_amount, created_at FROM orders WHERE tracking_code = ?', [req.params.code]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found / كود التتبع غير صحيح' });
    }

    const items = await db.all(
      `SELECT oi.quantity, oi.price, p.name_ar, p.name_en 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Order (Public Storefront checkout - quick checkout)
app.post('/api/orders', async (req, res) => {
  const { customer_name, customer_phone, customer_address, quantity, product_id, coupon_code, payment_method } = req.body;

  if (!customer_name || !customer_phone || !customer_address || !quantity || !product_id) {
    return res.status(400).json({ message: 'All form fields are required / يرجى إدخال جميع الخانات' });
  }

  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be positive / يجب أن تكون الكمية أكبر من 0' });
  }

  try {
    // 1. Fetch and validate product
    const product = await db.get('SELECT * FROM products WHERE id = ? AND status = "active"', [product_id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unavailable / المنتج غير متوفر حالياً' });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: `Only ${product.stock} items left in stock / الكمية المطلوبة غير متوفرة بالكامل في المخزن` });
    }

    // Calculate subtotal
    const subtotal = product.price * qty;
    let discountAmount = 0;

    // 2. Validate coupon if provided
    if (coupon_code) {
      const coupon = await db.get('SELECT * FROM coupons WHERE code = ? AND active = 1', [coupon_code.toUpperCase()]);
      if (coupon) {
        const currentDate = new Date().toISOString();
        if (!coupon.expiry_date || coupon.expiry_date > currentDate) {
          if (coupon.usage_limit === null || coupon.usage_count < coupon.usage_limit) {
            if (subtotal >= coupon.min_order_value) {
              if (coupon.discount_type === 'percentage') {
                discountAmount = (subtotal * coupon.discount_value) / 100;
              } else {
                discountAmount = coupon.discount_value;
              }
              // Limit discount to not exceed subtotal
              if (discountAmount > subtotal) discountAmount = subtotal;

              // Update coupon usage count
              await db.run('UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?', [coupon.id]);
            }
          }
        }
      }
    }

    // Dynamic shipping fee is initially 0 as per instructions:
    // "عند إرسال الطلب، يتم حفظه في قاعدة البيانات مع جعل مصاريف الشحن افتراضياً 0"
    const shippingFee = 0;
    const totalAmount = subtotal - discountAmount + shippingFee;

    // Generate unique order number and tracking code
    const orderNumber = `YP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingCode = `TR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // 3. Save order using transaction-like step
    const orderResult = await db.run(
      `INSERT INTO orders (order_number, customer_name, customer_phone, customer_address, status, subtotal, shipping_fee, total_amount, coupon_code, discount_amount, payment_method, tracking_code)
       VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customer_name,
        customer_phone,
        customer_address,
        subtotal,
        shippingFee,
        totalAmount,
        coupon_code || null,
        discountAmount,
        payment_method || 'cod',
        trackingCode
      ]
    );

    const orderId = orderResult.lastID;

    // Insert Order Item
    await db.run(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, product.id, qty, product.price]
    );

    // 4. Update product stock
    await db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, product.id]);

    // 5. Update or Create Customer Profile
    const existingCustomer = await db.get('SELECT id, orders_count, total_spent FROM customers WHERE phone = ?', [customer_phone]);
    if (existingCustomer) {
      await db.run(
        `UPDATE customers 
         SET name = ?, address = ?, orders_count = orders_count + 1, total_spent = total_spent + ? 
         WHERE id = ?`,
        [customer_name, customer_address, totalAmount, existingCustomer.id]
      );
    } else {
      await db.run(
        `INSERT INTO customers (name, phone, address, orders_count, total_spent) 
         VALUES (?, ?, ?, 1, ?)`,
        [customer_name, customer_phone, customer_address, totalAmount]
      );
    }

    res.status(201).json({
      id: orderId,
      order_number: orderNumber,
      tracking_code: trackingCode,
      subtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      message: 'Order created successfully / تم تسجيل طلبك بنجاح'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update Order Status (Admin/Manager/Staff)
app.put('/api/orders/:id/status', authenticateToken, authorizeRoles('admin', 'manager', 'staff'), async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await db.run(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // If order was cancelled, return stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [id]);
      for (const item of items) {
        if (item.product_id) {
          await db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
        }
      }
    } 
    // If reactivated from cancelled
    else if (order.status === 'cancelled' && status !== 'cancelled') {
      const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [id]);
      for (const item of items) {
        if (item.product_id) {
          await db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
        }
      }
    }

    res.json({ message: 'Order status updated successfully / تم تحديث حالة الطلب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update manual shipping fee for order (Admin/Manager/Staff)
// "في لوحة التحكم خانة مصاريف الشحن يدوية لكل طلب، والإجمالي النهائي يتحدث بعد ما أكتبها. ممنوع أي رقم شحن ثابت في الكود"
app.put('/api/orders/:id/shipping', authenticateToken, authorizeRoles('admin', 'manager', 'staff'), async (req, res) => {
  const { shipping_fee } = req.body;
  const { id } = req.params;

  const fee = parseFloat(shipping_fee);
  if (isNaN(fee) || fee < 0) {
    return res.status(400).json({ message: 'Shipping fee must be a valid non-negative number / يرجى إدخال قيمة مصاريف شحن صحيحة' });
  }

  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Dynamic Recalculation: Total = Subtotal - Discount + Shipping Fee
    const newTotal = order.subtotal - order.discount_amount + fee;

    await db.run(
      'UPDATE orders SET shipping_fee = ?, total_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [fee, newTotal, id]
    );

    // Update Customer profile spent amount too
    const customer = await db.get('SELECT id, total_spent FROM customers WHERE phone = ?', [order.customer_phone]);
    if (customer) {
      // Calculate diff in total to update customer spent
      const totalDiff = newTotal - order.total_amount;
      await db.run('UPDATE customers SET total_spent = total_spent + ? WHERE id = ?', [totalDiff, customer.id]);
    }

    res.json({ 
      message: 'Shipping fee updated successfully / تم تحديث مصاريف الشحن بنجاح',
      shipping_fee: fee,
      total_amount: newTotal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Order (Admin Only)
app.delete('/api/orders/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete items first (due to FK cascade, but doing explicitly or letting SQLite handle it)
    await db.run('DELETE FROM orders WHERE id = ?', [id]);

    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?, 'success')`,
      [req.user.id, 'ORDER_DELETED', `Deleted order number: ${order.order_number}`, req.ip, req.headers['user-agent']]
    );

    res.json({ message: 'Order deleted successfully / تم حذف الطلب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 6. Customer Management APIs
// ==========================================
app.get('/api/customers', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const customers = await db.all('SELECT * FROM customers ORDER BY total_spent DESC');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/customers/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const customer = await db.get('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const orders = await db.all('SELECT * FROM orders WHERE customer_phone = ? ORDER BY id DESC', [customer.phone]);
    res.json({ ...customer, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 7. Coupon Management APIs
// ==========================================
app.get('/api/coupons', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const coupons = await db.all('SELECT * FROM coupons ORDER BY id DESC');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/coupons', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  const { code, discount_type, discount_value, min_order_value, expiry_date, usage_limit } = req.body;

  if (!code || !discount_type || !discount_value) {
    return res.status(400).json({ message: 'Code, type, and value are required / الحقول الأساسية للكوبون مطلوبة' });
  }

  try {
    const result = await db.run(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order_value, active, expiry_date, usage_limit, usage_count) 
       VALUES (?, ?, ?, ?, 1, ?, ?, 0)`,
      [
        code.toUpperCase(),
        discount_type,
        parseFloat(discount_value),
        min_order_value ? parseFloat(min_order_value) : 0,
        expiry_date || null,
        usage_limit ? parseInt(usage_limit) : null
      ]
    );
    res.status(201).json({ id: result.lastID, code, discount_type, discount_value });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Coupon code already exists / رمز الكوبون موجود بالفعل' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/coupons/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  const { active, usage_limit, expiry_date } = req.body;
  const { id } = req.params;
  try {
    await db.run(
      'UPDATE coupons SET active = ?, usage_limit = ?, expiry_date = ? WHERE id = ?',
      [active !== undefined ? active : 1, usage_limit || null, expiry_date || null, id]
    );
    res.json({ message: 'Coupon updated successfully / تم تحديث الكوبون بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/coupons/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    await db.run('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted successfully / تم حذف الكوبون بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate Coupon (Public for storefront)
app.post('/api/coupons/validate', async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Coupon code is required / يرجى إدخال كود الخصم' });
  }

  try {
    const coupon = await db.get('SELECT * FROM coupons WHERE code = ? AND active = 1', [code.toUpperCase()]);
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code / كود الخصم غير صحيح' });
    }

    const currentDate = new Date().toISOString();
    if (coupon.expiry_date && coupon.expiry_date < currentDate) {
      return res.status(400).json({ message: 'Coupon has expired / انتهت صلاحية كوبون الخصم' });
    }

    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Coupon usage limit reached / انتهى الحد الأقصى لاستخدام الكوبون' });
    }

    const parsedSubtotal = parseFloat(subtotal) || 0;
    if (parsedSubtotal < coupon.min_order_value) {
      return res.status(400).json({ 
        message: `Min order value for this coupon is ${coupon.min_order_value} / الحد الأدنى لتفعيل الكوبون هو ${coupon.min_order_value}` 
      });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 8. General Settings APIs
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM settings');
    const settingsObj = {};
    rows.forEach(row => {
      settingsObj[row.key] = row.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/settings', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const settings = req.body; // Key-value object
  try {
    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        await db.run(
          'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
          [key, settings[key], settings[key]]
        );
      }
    }

    await db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?, 'success')`,
      [req.user.id, 'SETTINGS_UPDATED', 'Store settings updated', req.ip, req.headers['user-agent']]
    );

    res.json({ message: 'Settings updated successfully / تم تحديث الإعدادات بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 9. Audit Logs API (Admin Only)
// ==========================================
app.get('/api/logs', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const logs = await db.all(
      `SELECT al.*, u.username 
       FROM audit_logs al 
       LEFT JOIN users u ON al.user_id = u.id 
       ORDER BY al.id DESC LIMIT 100`
    );
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 10. Dashboard & Report Statistics API
// ==========================================
app.get('/api/dashboard/stats', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    // Total Sales (only for confirmed or delivered orders)
    const salesRow = await db.get(
      'SELECT SUM(total_amount) as total FROM orders WHERE status IN ("confirmed", "delivered")'
    );
    const totalSales = salesRow.total || 0;

    // Total Orders
    const ordersRow = await db.get('SELECT COUNT(*) as count FROM orders');
    const totalOrders = ordersRow.count || 0;

    // Low stock products alert count
    const stockRow = await db.get('SELECT COUNT(*) as count FROM products WHERE stock <= min_stock_alert');
    const lowStockAlerts = stockRow.count || 0;

    // Active coupons
    const couponsRow = await db.get('SELECT COUNT(*) as count FROM coupons WHERE active = 1');
    const activeCoupons = couponsRow.count || 0;

    // Sales by date (Last 15 days) for chart
    const salesChart = await db.all(
      `SELECT DATE(created_at) as date, SUM(total_amount) as sales, COUNT(*) as count
       FROM orders 
       WHERE status IN ("confirmed", "delivered") AND created_at >= date('now', '-15 days')
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // Low stock items details
    const lowStockProducts = await db.all(
      'SELECT id, name_ar, name_en, stock, min_stock_alert, sku FROM products WHERE stock <= min_stock_alert ORDER BY stock ASC'
    );

    // Recent 5 orders
    const recentOrders = await db.all(
      'SELECT id, order_number, customer_name, total_amount, status, created_at FROM orders ORDER BY id DESC LIMIT 5'
    );

    // Orders status summary breakdown
    const orderStatuses = await db.all(
      'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
    );

    res.json({
      summary: {
        totalSales,
        totalOrders,
        lowStockAlerts,
        activeCoupons
      },
      salesChart,
      lowStockProducts,
      recentOrders,
      orderStatuses
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Your Place Server is running on port ${PORT}`);
});
