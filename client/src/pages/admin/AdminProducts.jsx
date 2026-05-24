import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Loader from '../../components/common/Loader';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/products/admin/all?${params}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted!');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{pagination.total ?? 0} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-11"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-dark-400 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No products found</p>
            <Link to="/admin/products/new" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add your first product
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600 bg-dark-700/50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-dark-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[160px]">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-400">
                          {product.category?.icon} {product.category?.name || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-display font-semibold text-white">${product.price?.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`badge ${product.isActive ? 'badge-green' : 'badge-red'}`}>
                          {product.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 rounded-lg bg-dark-600 hover:bg-primary-500/10 text-gray-400 hover:text-primary-400 border border-dark-500 hover:border-primary-500/30 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-lg bg-dark-600 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-dark-500 hover:border-red-500/30 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-dark-600">
                <span className="text-xs text-gray-500">
                  Page {page} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40">Prev</button>
                  <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-display font-semibold text-white">Delete Product?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{deleteConfirm.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
