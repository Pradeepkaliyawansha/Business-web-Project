import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Loader from "../../components/common/Loader";

const emojis = [
  "📱",
  "💻",
  "🎧",
  "📷",
  "🎮",
  "⌚",
  "🖨️",
  "🔋",
  "📺",
  "🖥️",
  "🎙️",
  "🔌",
];
const defaultForm = { name: "", description: "", icon: "📦", isActive: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories/admin/all");
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (cat = null) => {
    setEditTarget(cat);
    setForm(
      cat
        ? {
            name: cat.name,
            description: cat.description || "",
            icon: cat.icon || "📦",
            isActive: cat.isActive,
          }
        : defaultForm,
    );
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(defaultForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await api.put(`/categories/${editTarget._id}`, form);
        toast.success("Category updated!");
      } else {
        await api.post("/categories", form);
        toast.success("Category created!");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted!");
      setDeleteConfirm(null);
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="font-display font-bold text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            Categories
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <div className="card p-16 text-center">
          <Tag
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "var(--border-color-dark)" }}
          />
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>
            No categories yet
          </p>
          <button onClick={() => openModal()} className="btn-primary">
            Add First Category
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{cat.icon}</div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(cat)}
                    className="p-1.5 rounded-lg border transition-all hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/30"
                    style={{
                      backgroundColor: "var(--bg-surface-2)",
                      borderColor: "var(--border-color-dark)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat)}
                    className="p-1.5 rounded-lg border transition-all hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                    style={{
                      backgroundColor: "var(--bg-surface-2)",
                      borderColor: "var(--border-color-dark)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3
                className="font-display font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {cat.name}
              </h3>
              {cat.description && (
                <p
                  className="text-xs mt-1 line-clamp-2"
                  style={{ color: "var(--text-dimmer)" }}
                >
                  {cat.description}
                </p>
              )}
              <div
                className="flex items-center justify-between mt-3 pt-3 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--text-dimmer)" }}
                >
                  {cat.slug}
                </span>
                <span
                  className={`badge text-xs ${cat.isActive ? "badge-green" : "badge-red"}`}
                >
                  {cat.isActive ? "Active" : "Hidden"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modal-box p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "var(--text-primary)" }}
              >
                {editTarget ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 transition-colors hover:text-primary-400"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Smartphones"
                  required
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field resize-none text-sm"
                  placeholder="Brief description..."
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Icon
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, icon: emoji })}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all border ${
                        form.icon === emoji
                          ? "bg-primary-500/20 border-primary-500 border-2"
                          : ""
                      }`}
                      style={
                        form.icon !== emoji
                          ? {
                              backgroundColor: "var(--bg-surface-2)",
                              borderColor: "var(--border-color-dark)",
                            }
                          : {}
                      }
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="input-field text-sm"
                  placeholder="Or type any emoji"
                  maxLength={4}
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-primary-500" : ""} relative cursor-pointer flex-shrink-0`}
                  style={
                    !form.isActive
                      ? { backgroundColor: "var(--bg-surface-2)" }
                      : {}
                  }
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Active
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Saving...
                    </>
                  ) : editTarget ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
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
                Delete Category?
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Delete{" "}
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                "{deleteConfirm.name}"
              </span>
              ? Products in this category won't be deleted but may lose their
              category.
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
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
