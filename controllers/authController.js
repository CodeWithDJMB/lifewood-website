const bcrypt = require('bcryptjs');
const db = require('../services/DatabaseService');

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const results = await db.query('SELECT * FROM admins WHERE admin_email = ?', [email]);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.admin_password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If login is successful, you can set a session or token here
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
};