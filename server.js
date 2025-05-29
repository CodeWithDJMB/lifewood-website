require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { insertSuperAdmin } = require('./services/SuperAdminService');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Use the session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Use the auth routes
app.use('/auth', authRoutes);

// Use the client routes
app.use('/client', clientRoutes);

// Use the admin routes
app.use('/admin', adminRoutes);

// Insert Super Admin at startup (only once)
insertSuperAdmin().catch((err) => console.error('Error inserting admin:', err));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});