const Product = require('../models/Product');
const Bakery = require('../models/Bakery');

const createProduct = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ owner_id: req.user.id });
    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    const {
      name,
      description,
      price,
      weight_options,
      egg_type,
      category,
      custom_message_available
    } = req.body;

    const product = new Product({
      bakery_id: bakery._id,
      name,
      description,
      price,
      weight_options: weight_options || [{ weight: '1kg', price }],
      egg_type,
      category,
      image_url: req.file ? `/uploads/${req.file.filename}` : '',
      custom_message_available: custom_message_available || false
    });

    await product.save();
    await product.populate('bakery_id', 'bakery_name city');
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const { bakery_id, category, city, page = 1, limit = 20 } = req.query;
    
    let query = { is_available: true };
    
    if (bakery_id) {
      query.bakery_id = bakery_id;
    } else if (city) {
      const bakeries = await Bakery.find({ city: { $regex: city, $options: 'i' }, is_approved: true });
      query.bakery_id = { $in: bakeries.map(b => b._id) };
    }
    
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('bakery_id', 'bakery_name city address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ owner_id: req.user.id });
    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    const products = await Product.find({ bakery_id: bakery._id })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ owner_id: req.user.id });
    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    const product = await Product.findOne({ 
      _id: req.params.id, 
      bakery_id: bakery._id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      weight_options,
      egg_type,
      category,
      is_available,
      custom_message_available
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (weight_options) product.weight_options = weight_options;
    if (egg_type) product.egg_type = egg_type;
    if (category) product.category = category;
    if (typeof is_available !== 'undefined') product.is_available = is_available;
    if (typeof custom_message_available !== 'undefined') {
      product.custom_message_available = custom_message_available;
    }

    if (req.file) {
      product.image_url = `/uploads/${req.file.filename}`;
    }

    await product.save();
    await product.populate('bakery_id', 'bakery_name city');
    
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ owner_id: req.user.id });
    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    const product = await Product.findOne({ 
      _id: req.params.id, 
      bakery_id: bakery._id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createProduct, 
  getProducts, 
  getMyProducts, 
  updateProduct, 
  deleteProduct 
};