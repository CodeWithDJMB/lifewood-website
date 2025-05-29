const db = require('./DatabaseService');
const bcrypt = require('bcryptjs');

async function insertSuperAdmin() {
    try {
        console.log('Checking if super admin exists...');
        const superAdminExists = await db.query('SELECT * FROM admins WHERE admin_role = ?', ['super_admin']);
        console.log('Super admin check result:', superAdminExists);

        if (superAdminExists.length === 0) {
            console.log('Inserting super admin...');
            const hashedPassword = await bcrypt.hash('davidisadmin', 10); // Hash the password

            await db.query(
                'INSERT INTO admins (admin_fname, admin_lname, admin_role, admin_email, admin_password) VALUES (?, ?, ?, ?, ?)',
                ['Davide', 'Ompokern', 'super_admin', 'david@gmail.com', hashedPassword]
            );

            console.log('Super admin inserted successfully');
        } else {
            console.log('Super admin already exists');
        }
    } catch (err) {
        console.error('Error inserting super admin:', err);
        throw err;
    }
}

module.exports = { insertSuperAdmin };
