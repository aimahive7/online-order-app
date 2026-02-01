const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const { 
  createProduct, 
  getProducts, 
  getMyProducts, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

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

router.post('/', auth, authorize('baker'), upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/my', auth, authorize('baker'), getMyProducts);
router.put('/:id', auth, authorize('baker'), upload.single('image'), updateProduct);
router.delete('/:id', auth, authorize('baker'), deleteProduct);

module.exports = router;