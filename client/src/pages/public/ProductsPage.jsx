import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import Loader from '../../components/common/Loader';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    featured: searchParams.get('featured') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== '-createdAt' && v !== '1') params.set(k, v); });
    setSearchParams(params);
  }, [filters, fetchProducts]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  const clearFilters = () => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt', featured: '', page: 1 });

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Top Rated' },
  ];

  const hasFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.featured;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">All Products</h1>
          <p className="text-gray-400 text-sm mt-1">
            {pagination.total ? `${pagination.total} products found` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
              <X className="w-4 h-4" /> Clear filters
            </button>
          )}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 btn-secondary text-sm py-2.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search products, brands..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="input-field pl-11"
        />
        {filters.search && (
          <button onClick={() => updateFilter('search', '')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-500 hover:text-white" />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="card p-5 mb-6 animate-slide-down grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">Category</label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="input-field appearance-none pr-8 py-2.5 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">Sort By</label>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field appearance-none pr-8 py-2.5 text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Min Price */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">Min Price ($)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="input-field py-2.5 text-sm"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-xs text-gray-400 font-medium mb-2 block">Max Price ($)</label>
            <input
              type="number"
              placeholder="9999"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="input-field py-2.5 text-sm"
            />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featured === 'true'}
                onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-400">Featured only</span>
            </label>
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" text="Loading products..." /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display font-semibold text-xl text-white mb-2">No products found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                disabled={filters.page <= 1}
                onClick={() => updateFilter('page', filters.page - 1)}
                className="btn-secondary py-2 px-4 disabled:opacity-40"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateFilter('page', i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      filters.page === i + 1
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={filters.page >= pagination.pages}
                onClick={() => updateFilter('page', filters.page + 1)}
                className="btn-secondary py-2 px-4 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
