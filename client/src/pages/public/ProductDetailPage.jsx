import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Tag, Package, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../../components/common/Loader";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to leave a review");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success("Review submitted!");
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!product)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">😔</div>
        <h2
          className="font-display font-bold text-2xl"
          style={{ color: "var(--text-primary)" }}
        >
          Product not found
        </h2>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const getSpecEntries = (specs) => {
    if (!specs) return [];
    if (typeof specs.entries === "function") return [...specs.entries()];
    if (typeof specs === "object") return Object.entries(specs);
    return [];
  };
  const specEntries = getSpecEntries(product.specifications);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 text-sm mb-8"
        style={{ color: "var(--text-dimmer)" }}
      >
        <Link to="/" className="hover:text-primary-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          className="hover:text-primary-400 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="truncate" style={{ color: "var(--text-secondary)" }}>
          {product.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div
            className="aspect-square rounded-2xl overflow-hidden border mb-4"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border-color)",
            }}
          >
            {product.images?.[activeImage]?.url ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ color: "var(--border-color-dark)" }}
              >
                <Package className="w-24 h-24" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-primary-500" : ""}`}
                  style={
                    activeImage !== i
                      ? { borderColor: "var(--border-color)" }
                      : {}
                  }
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.category && (
              <span className="badge-orange">
                {product.category.icon} {product.category.name}
              </span>
            )}
            {product.isFeatured && (
              <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                ⭐ Featured
              </span>
            )}
          </div>

          <h1
            className="font-display font-bold text-3xl lg:text-4xl leading-tight mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {product.name}
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--text-dimmer)" }}>
            {product.brand}
          </p>

          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : ""}`}
                    style={
                      i >= Math.round(product.rating)
                        ? { color: "var(--border-color-dark)" }
                        : {}
                    }
                  />
                ))}
              </div>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="font-display font-bold text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span
                className="text-lg line-through"
                style={{ color: "var(--text-dimmer)" }}
              >
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-primary-500 text-white text-sm px-3 py-1 rounded-lg font-bold">
                -{discount}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <span className="text-sm text-red-400 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <p
            className="leading-relaxed mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            {product.description}
          </p>

          {product.features?.length > 0 && (
            <div className="mb-6">
              <h3
                className="font-display font-semibold text-sm mb-3 uppercase tracking-wide"
                style={{ color: "var(--text-primary)" }}
              >
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="text-primary-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: "var(--tag-bg)",
                    borderColor: "var(--tag-border)",
                    color: "var(--tag-text)",
                  }}
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          <button
            disabled={product.stock === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Specifications */}
      {specEntries.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">Specifications</h2>
          <div className="card overflow-hidden">
            {specEntries.map(([key, value], i) => (
              <div
                key={key}
                className="flex px-6 py-4"
                style={
                  i % 2 === 0 ? { backgroundColor: "var(--bg-surface)" } : {}
                }
              >
                <span
                  className="text-sm w-48 flex-shrink-0 font-medium capitalize"
                  style={{ color: "var(--text-muted)" }}
                >
                  {key}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="section-title mb-8">Customer Reviews</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {product.reviews?.length === 0 ? (
              <div className="card p-8 text-center">
                <p style={{ color: "var(--text-muted)" }}>
                  No reviews yet. Be the first!
                </p>
              </div>
            ) : (
              product.reviews?.map((r) => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {r.name}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : ""}`}
                          style={
                            i >= r.rating
                              ? { color: "var(--border-color-dark)" }
                              : {}
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {r.comment}
                  </p>
                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--text-dimmer)" }}
                  >
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {user ? (
            <div className="card p-6">
              <h3
                className="font-display font-semibold mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label
                    className="text-sm block mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview({ ...review, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "hover:text-yellow-400"}`}
                          style={
                            star > review.rating
                              ? { color: "var(--border-color-dark)" }
                              : {}
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm block mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Your Comment
                  </label>
                  <textarea
                    rows={4}
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    placeholder="Share your experience..."
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                Login to write a review
              </p>
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
