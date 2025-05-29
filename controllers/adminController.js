const db = require('../services/DatabaseService');
const path = require('path');
const fs = require('fs');

exports.getApplications = async (req, res) => {
    try {
        const query = 'SELECT * FROM applications';
        const rows = await db.query(query);
        console.log("Fetched Rows:", rows); // Debugging statement
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.approveApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE applications SET app_status = ?, app_approved_at = NOW() WHERE app_id = ?';
        await db.query(query, ['approved', id]);
        res.status(200).json({ message: 'Application approved successfully' });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ message: 'Error approving application', error });
    }
};

exports.rejectApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE applications SET app_status = ?, app_rejected_at = NOW() WHERE app_id = ?';
        await db.query(query, ['rejected', id]);
        res.status(200).json({ message: 'Application rejected successfully' });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ message: 'Error rejecting application', error });
    }
};

exports.viewResume = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT app_resume_path FROM applications WHERE app_id = ?';
        const rows = await db.query(query, [id]);

        if (rows.length === 0) {
            console.error('Resume not found for application ID:', id); // Debugging statement
            return res.status(404).json({ message: 'Resume not found' });
        }

        const resumePath = path.join(__dirname, '..', rows[0].app_resume_path);
        console.log('Sending resume file:', resumePath); // Debugging statement

        // Check if the file exists
        if (!fs.existsSync(resumePath)) {
            console.error('Resume file does not exist:', resumePath); // Debugging statement
            return res.status(404).json({ message: 'Resume file not found' });
        }

        res.sendFile(resumePath);
    } catch (error) {
        console.error('Error viewing resume:', error);
        res.status(500).json({ message: 'Error viewing resume', error });
    }
};

exports.downloadResume = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT app_resume_path FROM applications WHERE app_id = ?';
        const rows = await db.query(query, [id]);

        if (rows.length === 0) {
            console.error('Resume not found for application ID:', id); // Debugging statement
            return res.status(404).json({ message: 'Resume not found' });
        }

        const resumePath = path.join(__dirname, '..', rows[0].app_resume_path);
        console.log('Downloading resume file:', resumePath); // Debugging statement
        res.download(resumePath);
    } catch (error) {
        console.error('Error downloading resume:', error);
        res.status(500).json({ message: 'Error downloading resume', error });
    }
};

// New controller method to get application details by ID
exports.viewApplicationInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT * FROM applications WHERE app_id = ?';
        const rows = await db.query(query, [id]);

        if (rows.length === 0) {
            console.error('Application not found for ID:', id); // Debugging statement
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({ message: 'Error fetching application details', error });
    }
};