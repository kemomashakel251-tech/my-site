import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Store database in the db/ subdirectory inside backend
const dbDir = join(__dirname, 'db');
const dbPath = join(dbDir, 'database.sqlite');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite Database
const dbConnection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    // Enable Foreign Key constraints for SQLite
    dbConnection.run('PRAGMA foreign_keys = ON;', (fkErr) => {
      if (fkErr) {
        console.error('Failed to enable foreign keys:', fkErr.message);
      }
    });
  }
});

// Wrap callback methods with Promises to allow async/await syntax and enforce prepared statements
export const db = {
  /**
   * Run a query that does not return rows (INSERT, UPDATE, DELETE).
   * Automatically protects against SQL injection when parameters are passed.
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      dbConnection.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          // 'this' refers to the statement context, containing lastID and changes
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  },

  /**
   * Fetch a single row (SELECT ... LIMIT 1)
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      dbConnection.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  /**
   * Fetch multiple rows (SELECT ...)
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      dbConnection.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  /**
   * Run a batch of raw SQL (like schema files)
   */
  exec(sql) {
    return new Promise((resolve, reject) => {
      dbConnection.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Close database connection
   */
  close() {
    return new Promise((resolve, reject) => {
      dbConnection.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

export default db;
