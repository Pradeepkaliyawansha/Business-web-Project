import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Image as ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { PageLoader } from "../../components/common/Loader";

const initialForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "",
  brand: "",
  stock: "",
  sku: "",
  isFeatured: false,
  isActive: true,
  features: [],
  tags: [],
  images: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          originalPrice: p.originalPrice || "",
          category: p.category?._id || "",
          brand: p.brand || "",
          stock: p.stock || "",
          sku: p.sku || "",
          isFeatured: p.isFeatured || false,
          isActive: p.isActive !== false,
          features: p.features || [],
          tags: p.tags || [],
          images: p.images || [],
        });
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  // ── Local file upload ──────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data.success) {
          uploaded.push({ url: data.url, public_id: data.public_id });
        }
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploaded.length) {
      set("images", [...form.images, ...uploaded]);
      toast.success(
        `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded!`,
      );
    }

    setUploading(false);
    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const handleRemoveImage = async (i) => {
    const img = form.images[i];
    // Optimistically remove from UI
    set(
      "images",
      form.images.filter((_, idx) => idx !== i),
    );

    // If it's a Cloudinary image, delete it from the cloud
    if (img.public_id) {
      try {
        await api.delete(`/upload/${encodeURIComponent(img.public_id)}`);
      } catch {
        // Non-fatal — image already removed from the form
      }
    }
  };

  // ── URL-based add (keep existing behaviour) ───────────────────────────────
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    set("images", [...form.images, { url: newImageUrl.trim(), public_id: "" }]);
    setNewImageUrl("");
  };

  // ── Features / Tags ───────────────────────────────────────────────────────
  const addFeature = () => {
    if (!newFeature.trim()) return;
    set("features", [...form.features, newFeature.trim()]);
    setNewFeature("");
  };
  const removeFeature = (i) =>
    set(
      "features",
      form.features.filter((_, idx) => idx !== i),
    );

  const addTag = () => {
    if (!newTag.trim()) return;
    set("tags", [...form.tags, newTag.trim()]);
    setNewTag("");
  };
  const removeTag = (i) =>
    set(
      "tags",
      form.tags.filter((_, idx) => idx !== i),
    );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated!");
      } else {
        await api.post("/products", payload);
        toast.success("Product created!");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl bg-dark-700 border border-dark-600 hover:border-dark-400 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            {isEdit ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isEdit
              ? "Update product details"
              : "Add a new product to your store"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5 pb-3 border-b border-dark-600">
            Basic Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="input-field"
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Brand *
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                className="input-field"
                placeholder="e.g. Sony"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                SKU
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                className="input-field"
                placeholder="e.g. SONY-WH1000XM5-BLK"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="input-field resize-none"
                placeholder="Describe the product..."
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5 pb-3 border-b border-dark-600">
            Pricing & Inventory
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                className="input-field"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set higher than price to show discount
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className="input-field"
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5 pb-3 border-b border-dark-600">
            Product Images
          </h2>

          {/* Upload from device */}
          <div className="mb-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-dark-500 hover:border-primary-500/50 bg-dark-700/30 hover:bg-primary-500/5 rounded-xl p-8 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                  <span className="text-sm text-primary-400 font-medium">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <Upload className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      Click to upload from device
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP up to 5 MB · Multiple files supported
                    </p>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-dark-600" />
            <span className="text-xs text-gray-500 font-medium">
              or add via URL
            </span>
            <div className="flex-1 h-px bg-dark-600" />
          </div>

          {/* URL-based add */}
          <div className="flex gap-3 mb-5">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="input-field flex-1"
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImage())
              }
            />
            <button
              type="button"
              onClick={addImage}
              className="btn-secondary flex items-center gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Image grid */}
          {form.images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="relative group aspect-square bg-dark-700 rounded-xl overflow-hidden border border-dark-600"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded-md font-medium">
                      Main
                    </span>
                  )}
                  {img.public_id && (
                    <span
                      className="absolute top-1.5 left-1.5 w-5 h-5 bg-green-500/80 rounded-full flex items-center justify-center"
                      title="Uploaded to cloud"
                    >
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dark-600 rounded-xl p-6 text-center">
              <ImageIcon className="w-8 h-8 text-dark-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No images added yet</p>
            </div>
          )}

          {form.images.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Drag to reorder · First image is shown as the main product photo ·
              Green badge = uploaded to cloud
            </p>
          )}
        </div>

        {/* Features & Tags */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5 pb-3 border-b border-dark-600">
            Features & Tags
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Key Features
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="input-field flex-1 text-sm py-2.5"
                  placeholder="e.g. Noise cancellation"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-secondary py-2.5 px-3 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                {form.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-dark-700 rounded-lg px-3 py-2"
                  >
                    <span className="text-primary-400 text-sm">✓</span>
                    <span className="text-sm text-gray-300 flex-1">{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 font-medium block mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input-field flex-1 text-sm py-2.5"
                  placeholder="e.g. wireless"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary py-2.5 px-3 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-dark-700 border border-dark-500 text-gray-300 text-xs px-2.5 py-1.5 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5 pb-3 border-b border-dark-600">
            Settings
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            {[
              {
                key: "isFeatured",
                label: "Featured Product",
                desc: "Show on homepage featured section",
              },
              {
                key: "isActive",
                label: "Active / Visible",
                desc: "Product visible to customers",
              },
            ].map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => set(key, !form[key])}
                    className={`w-11 h-6 rounded-full transition-colors ${form[key] ? "bg-primary-500" : "bg-dark-500"} relative cursor-pointer`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Link
            to="/admin/products"
            className="btn-secondary flex-1 sm:flex-none sm:px-8 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-primary flex-1 sm:flex-none sm:px-8 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
