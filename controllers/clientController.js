const db = require('../services/DatabaseService');
const path = require('path');
const fs = require('fs');

exports.apply = async (req, res) => {
    const { firstName, lastName, email, phone, address, position } = req.body;
    const resume = req.file; // Multer should handle this

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !position || !resume) {
        // Delete uploaded file if validation fails
        if (resume?.path) {
            fs.unlinkSync(resume.path);
        }
        return res.status(400).json({ message: 'All fields are required' });
    }

    const resumePath = path.join('uploads', resume.filename);

    try {
        const query = `
            INSERT INTO applications (app_fname, app_lname, app_email, app_phone, app_address, app_position, app_resume_path, app_status, app_applied_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
        `;
        await db.query(query, [firstName, lastName, email, phone, address, position, resumePath]);

        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error submitting application:', error);

        // Delete the uploaded file if there is an error
        if (resume?.path) {
            fs.unlinkSync(resume.path);
        }
        res.status(500).json({ message: 'Error submitting application', error });
    }
};
