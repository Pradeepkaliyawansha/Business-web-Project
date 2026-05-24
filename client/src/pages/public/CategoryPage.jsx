import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { PageLoader } from '../../components/common/Loader';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await api.get('/categories');
        const cat = catRes.data.categories.find((c) => c.slug === slug);
        setCategory(cat);
        if (cat) {
          const prodRes = await api.get(`/products?category=${cat._id}&limit=24`);
          setProducts(prodRes.data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-300">{category?.name || slug}</span>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <div className="text-5xl">{category?.icon || '📦'}</div>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">{category?.name || slug}</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-display font-semibold text-xl text-white mb-2">No products yet</h3>
          <p className="text-gray-400 mb-6">Check back soon for new arrivals in this category</p>
          <Link to="/products" className="btn-primary">Browse All Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
