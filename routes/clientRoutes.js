const express = require('express');
const clientController = require('../controllers/clientController');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/application/apply', upload.single('resume'), (req, res, next) => {
    clientController.apply(req, res).catch(next);
});

router.post('/upload', upload.single('file'), (req, res, next) => {
    res.send('File uploaded successfully');
});

module.exports = router;