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

    const [rows] = await conn.execute('SELECT * FROM `users`');
    console.log("All users in DB:", rows.map(r => ({id: r.id, email: r.email, role: r.role})));

    const passwordHash = await bcrypt.hash('33213456', 10);
    const [result] = await conn.execute('UPDATE `users` SET password = ? WHERE role = ?', [passwordHash, 'ADMIN']);
    console.log("Update result:", result.info);

    process.exit();
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
})();
