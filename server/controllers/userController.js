import User from '../models/User.js';

// @desc  Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single user (Admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update user role/status (Admin)
export const updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User updated!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete user (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get dashboard stats (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const Category = (await import('../models/Category.js')).default;

    const [totalUsers, totalProducts, totalCategories, recentUsers, recentProducts] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Category.countDocuments({ isActive: true }),
        User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
        Product.find({ isActive: true })
          .sort('-createdAt')
          .limit(5)
          .populate('category', 'name'),
      ]);

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalCategories },
      recentUsers,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
