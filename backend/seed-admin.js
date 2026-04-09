const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'rose',
      password: process.env.DB_PASSWORD || '33213',
      database: process.env.DB_DATABASE || 'ecom_DB',
      port: parseInt(process.env.DB_PORT) || 3306
    });

    console.log('Connected to database.');

    const adminEmail = 'rose@admin.com';
    const adminPassword = '33213456';
    const adminName = 'Rose Admin';

    // Check if admin exists
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (rows.length > 0) {
      console.log('Admin user already exists. Updating password...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await conn.execute('UPDATE users SET password = ?, role = ? WHERE email = ?', [hashedPassword, 'ADMIN', adminEmail]);
      console.log('Admin password and role updated.');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await conn.execute(
        'INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [adminEmail, hashedPassword, adminName, 'ADMIN']
      );
      console.log(`Admin user created: ${adminEmail}`);
    }

    await conn.end();
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
})();
