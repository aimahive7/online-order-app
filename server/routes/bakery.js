const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const { createBakery, getBakeries, getMyBakery, updateBakery } = require('../controllers/bakeryController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.post('/', auth, authorize('baker'), upload.single('image'), createBakery);
router.get('/', getBakeries);
router.get('/my', auth, authorize('baker'), getMyBakery);
router.put('/my', auth, authorize('baker'), upload.single('image'), updateBakery);

module.exports = router;