import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

// ---- Inline models (avoids import path issues when run standalone) ----
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: 'user' }, isActive: { type: Boolean, default: true },
  avatar: String, phone: String, address: String,
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true }, slug: { type: String, unique: true, lowercase: true },
  description: String, icon: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (this.isModified('name'))
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  next();
});

const productSchema = new mongoose.Schema({
  name: String, description: String, price: Number, originalPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: String, images: [{ url: String, public_id: String }],
  stock: Number, rating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 },
  features: [String], tags: [String], isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// ---- Seed data ----
const categories = [
  { name: 'Smartphones', icon: '📱', description: 'Latest phones and accessories' },
  { name: 'Laptops', icon: '💻', description: 'Powerful laptops for work and gaming' },
  { name: 'Audio', icon: '🎧', description: 'Headphones, speakers, and earbuds' },
  { name: 'Cameras', icon: '📷', description: 'Cameras and photography gear' },
  { name: 'Gaming', icon: '🎮', description: 'Consoles, games, and accessories' },
  { name: 'Wearables', icon: '⌚', description: 'Smartwatches and fitness trackers' },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dilos-gadget');
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await User.create({
    name: 'Dilo Admin',
    email: 'admin@dilos.com',
    password: hashedPassword,
    role: 'admin',
  });
  console.log('👤 Admin created:', admin.email);

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 12);
  await User.create({ name: 'John Doe', email: 'user@dilos.com', password: userPassword });
  console.log('👤 Sample user created: user@dilos.com');

  // Create categories
  const createdCategories = await Category.insertMany(categories);
  console.log(`📂 ${createdCategories.length} categories created`);

  const catMap = {};
  createdCategories.forEach((c) => { catMap[c.name] = c._id; });

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro Max', brand: 'Apple', price: 1199, originalPrice: 1299,
      category: catMap['Smartphones'], stock: 50, isFeatured: true,
      description: 'The most powerful iPhone ever with titanium design and A17 Pro chip.',
      images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', public_id: '' }],
      features: ['A17 Pro chip', '48MP camera system', 'Titanium design', 'USB-C connector'],
      tags: ['apple', 'flagship', '5g'],
    },
    {
      name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 1099, originalPrice: 1299,
      category: catMap['Smartphones'], stock: 30, isFeatured: true,
      description: 'Ultimate Android flagship with built-in S Pen and 200MP camera.',
      images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', public_id: '' }],
      features: ['200MP camera', 'Built-in S Pen', 'Snapdragon 8 Gen 3', '5000mAh battery'],
      tags: ['samsung', 'android', 's-pen'],
    },
    {
      name: 'MacBook Pro 14" M3', brand: 'Apple', price: 1999, originalPrice: 2199,
      category: catMap['Laptops'], stock: 20, isFeatured: true,
      description: 'The ultimate pro laptop with M3 chip and Liquid Retina XDR display.',
      images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', public_id: '' }],
      features: ['M3 chip', 'Liquid Retina XDR', '18-hour battery', 'ProRes video'],
      tags: ['apple', 'laptop', 'professional'],
    },
    {
      name: 'Sony WH-1000XM5', brand: 'Sony', price: 349, originalPrice: 399,
      category: catMap['Audio'], stock: 80, isFeatured: true,
      description: 'Industry-leading noise canceling headphones with 30-hour battery life.',
      images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', public_id: '' }],
      features: ['Industry-best ANC', '30-hour battery', 'Multipoint connection', 'Speak-to-chat'],
      tags: ['sony', 'headphones', 'noise-canceling'],
    },
    {
      name: 'Canon EOS R6 Mark II', brand: 'Canon', price: 2499, originalPrice: 2699,
      category: catMap['Cameras'], stock: 15,
      description: 'Full-frame mirrorless camera with advanced autofocus and 4K video.',
      images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', public_id: '' }],
      features: ['40MP sensor', 'DIGIC X processor', '4K 60fps video', 'In-body stabilization'],
      tags: ['canon', 'mirrorless', 'photography'],
    },
    {
      name: 'PlayStation 5 Slim', brand: 'Sony', price: 449, originalPrice: 499,
      category: catMap['Gaming'], stock: 25, isFeatured: true,
      description: 'Next-gen gaming console with ultra-fast SSD and DualSense haptic feedback.',
      images: [{ url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', public_id: '' }],
      features: ['Custom SSD', 'Ray tracing', '4K @ 120fps', 'DualSense controller'],
      tags: ['sony', 'gaming', 'console'],
    },
    {
      name: 'Apple Watch Ultra 2', brand: 'Apple', price: 799, originalPrice: 849,
      category: catMap['Wearables'], stock: 40,
      description: 'The most capable and rugged Apple Watch for extreme adventures.',
      images: [{ url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500', public_id: '' }],
      features: ['Titanium case', '36-hour battery', 'Precision GPS', 'Water resistant 100m'],
      tags: ['apple', 'smartwatch', 'fitness'],
    },
    {
      name: 'Dell XPS 15', brand: 'Dell', price: 1799, originalPrice: 1999,
      category: catMap['Laptops'], stock: 18,
      description: 'Premium 15-inch laptop with OLED display and Intel Core i9 processor.',
      images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', public_id: '' }],
      features: ['OLED display', 'Intel Core i9', 'NVIDIA RTX 4060', '86Wh battery'],
      tags: ['dell', 'laptop', 'oled'],
    },
  ];

  await Product.insertMany(products);
  console.log(`📦 ${products.length} products created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('─────────────────────────────────');
  console.log('Admin: admin@dilos.com / admin123');
  console.log('User:  user@dilos.com  / user123');
  console.log('─────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
};

seedDB().catch((err) => { console.error(err); process.exit(1); });
