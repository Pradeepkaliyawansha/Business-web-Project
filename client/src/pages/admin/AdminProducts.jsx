import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Loader from "../../components/common/Loader";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set("search", search);
      const { data } = await api.get(`/products/admin/all?${params}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted!");
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="font-display font-bold text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            Products
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {pagination.total ?? 0} total products
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-dimmer)" }}
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input-field pl-11"
        />
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <Package
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: "var(--border-color-dark)" }}
            />
            <p
              className="font-medium mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              No products found
            </p>
            <Link
              to="/admin/products/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add your first product
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: "var(--table-header-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Status",
                      "Actions",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`text-left px-${i === 0 || i === 5 ? 5 : 4} py-3.5 text-xs font-semibold uppercase tracking-wider ${
                          i === 1
                            ? "hidden md:table-cell"
                            : i === 3 || i === 4
                              ? "hidden sm:table-cell"
                              : ""
                        } ${i === 5 ? "text-right" : ""}`}
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b transition-colors"
                      style={{ borderColor: "var(--border-color)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--table-row-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ backgroundColor: "var(--bg-surface-2)" }}
                          >
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package
                                  className="w-5 h-5"
                                  style={{ color: "var(--border-color-dark)" }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-sm font-medium truncate max-w-[160px]"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {product.name}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--text-dimmer)" }}
                            >
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {product.category?.icon}{" "}
                          {product.category?.name || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="font-display font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          ${product.price?.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span
                          className={`text-sm font-medium ${product.stock === 0 ? "text-red-400" : product.stock < 10 ? "text-yellow-400" : "text-green-400"}`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span
                          className={`badge ${product.isActive ? "badge-green" : "badge-red"}`}
                        >
                          {product.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 rounded-lg border transition-all hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/30"
                            style={{
                              backgroundColor: "var(--bg-surface-2)",
                              borderColor: "var(--border-color-dark)",
                              color: "var(--text-muted)",
                            }}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product)}
                            className="p-2 rounded-lg border transition-all hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                            style={{
                              backgroundColor: "var(--bg-surface-2)",
                              borderColor: "var(--border-color-dark)",
                              color: "var(--text-muted)",
                            }}
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
            {pagination.pages > 1 && (
              <div
                className="flex items-center justify-between px-5 py-4 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <span
                  className="text-xs"
                  style={{ color: "var(--text-dimmer)" }}
                >
                  Page {page} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modal-box p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3
                className="font-display font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Delete Product?
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Are you sure you want to delete{" "}
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                "{deleteConfirm.name}"
              </span>
              ? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
