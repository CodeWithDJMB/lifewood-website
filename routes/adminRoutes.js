const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/applications', (req, res, next) => {
    adminController.getApplications(req, res).catch(next);
});

router.post('/applications/approve/:id', (req, res, next) => {
    adminController.approveApplication(req, res).catch(next);
});

router.post('/applications/reject/:id', (req, res, next) => {
    adminController.rejectApplication(req, res).catch(next);
});

router.get('/applications/view-resume/:id', (req, res, next) => {
    adminController.viewResume(req, res).catch(next);
});

router.get('/applications/download-resume/:id', (req, res, next) => {
    adminController.downloadResume(req, res).catch(next);
});

// New route to get application details by ID
router.get('/applications/view-info/:id', (req, res, next) => {
    adminController.viewApplicationInfo(req, res).catch(next);
});

module.exports = router;