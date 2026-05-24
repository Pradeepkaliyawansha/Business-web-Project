import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products (with filtering, search, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      brand,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (featured === 'true') filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('category', 'name slug icon')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug icon')
      .populate('reviews.user', 'name avatar');

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, originalPrice,
      category, brand, stock, features,
      specifications, isFeatured, tags, sku, images,
    } = req.body;

    const product = await Product.create({
      name, description, price, originalPrice,
      category, brand, stock, features,
      specifications, isFeatured, tags, sku,
      images: images || [],
    });

    await product.populate('category', 'name slug icon');

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('category', 'name slug icon');

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Already reviewed this product.' });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.calculateRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin product list (includes inactive)
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
