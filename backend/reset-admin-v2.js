const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'rose',
      password: '33213',
      database: 'ecom_DB'
    });

    const email = 'rose@admin.com';
    const password = '33213456';
    const name = 'Admin Rose';
    const passwordHash = await bcrypt.hash(password, 10);

    // Update existing admin or insert if not exists
    const [rows] = await conn.execute('SELECT id FROM `users` WHERE role = "ADMIN"');
    
    if (rows.length > 0) {
      await conn.execute(
        'UPDATE `users` SET email = ?, password = ?, name = ? WHERE role = "ADMIN"',
        [email, passwordHash, name]
      );
      console.log(`Admin account updated: ${email}`);
    } else {
      await conn.execute(
        'INSERT INTO `users` (email, password, name, role) VALUES (?, ?, ?, "ADMIN")',
        [email, passwordHash, name]
      );
      console.log(`Admin account created: ${email}`);
    }

    await conn.end();
    process.exit();
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
