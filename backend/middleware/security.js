import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the backend/uploads directory exists for multer
const uploadsDir = join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * 1. General API Rate Limiter
 * Limits requests from a single IP to 300 requests per 15 minutes.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, 
  message: {
    message: 'Too many requests from this IP, please try again later. / عدد طلبات كبير جداً من هذا العنوان، يرجى المحاولة لاحقاً.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 2. Login Rate Limiter (Brute force protection)
 * Limits login attempts to 10 requests per 10 minutes.
 */
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    message: 'Too many login attempts. Account/IP blocked for 10 minutes. / محاولات دخول كثيرة خاطئة، يرجى المحاولة بعد 10 دقائق.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 3. HTML Sanitization Helper for XSS Protection
 * Recursively escapes HTML-sensitive characters in request data.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeInput(req, res, next) {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        }
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
}

/**
 * 4. Multer Secure Image Upload Configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a secure, unique filename to prevent directory traversal and file overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Extract file extension and sanitize
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// File filter to accept images only (protects against uploading executable scripts like PHP or JS)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed. / امتداد ملف غير مسموح، يُسمح بالصور فقط.'), false);
  }
};

// Export configured multer instance
export const uploadProductImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit size to 5MB
  }
});
