const Bakery = require('../models/Bakery');
const Product = require('../models/Product');

const createBakery = async (req, res) => {
  try {
    const { bakery_name, city, address, description } = req.body;

    const existingBakery = await Bakery.findOne({ owner_id: req.user.id });
    if (existingBakery) {
      return res.status(400).json({ message: 'You already have a bakery registered' });
    }

    const bakery = new Bakery({
      owner_id: req.user.id,
      bakery_name,
      city,
      address,
      description
    });

    await bakery.save();
    res.status(201).json(bakery);
  } catch (error) {
    console.error('Create bakery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBakeries = async (req, res) => {
  try {
    const { city, page = 1, limit = 10 } = req.query;
    
    let query = { is_approved: true };
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const bakeries = await Bakery.find(query)
      .populate('owner_id', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Bakery.countDocuments(query);

    res.json({
      bakeries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get bakeries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ owner_id: req.user.id })
      .populate('owner_id', 'name email phone');
    
    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    res.json(bakery);
  } catch (error) {
    console.error('Get my bakery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findOne({ owner_id: req.user.id });
    
    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    const { bakery_name, city, address, description } = req.body;
    
    if (bakery_name) bakery.bakery_name = bakery_name;
    if (city) bakery.city = city;
    if (address) bakery.address = address;
    if (description) bakery.description = description;

    await bakery.save();
    res.json(bakery);
  } catch (error) {
    console.error('Update bakery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBakery, getBakeries, getMyBakery, updateBakery };