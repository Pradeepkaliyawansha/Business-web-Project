import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('-createdAt');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;
    const category = await Category.create({ name, description, icon, image });
    res.status(201).json({
      success: true,
      message: 'Category created!',
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category updated!', category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
