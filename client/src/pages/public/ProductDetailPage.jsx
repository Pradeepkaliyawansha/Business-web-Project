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
        <h2 className="font-display font-bold text-2xl text-white">
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

  // Safely get specs entries - handles both Map and plain object
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
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
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
        <span className="text-gray-300 truncate">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-dark-700 rounded-2xl overflow-hidden border border-dark-600 mb-4">
            {product.images?.[activeImage]?.url ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark-500">
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
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? "border-primary-500"
                      : "border-dark-600 hover:border-dark-400"
                  }`}
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

          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight mb-2">
            {product.name}
          </h1>
          <p className="text-gray-500 text-sm mb-4">{product.brand}</p>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-dark-400"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display font-bold text-4xl text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-primary-500 text-white text-sm px-3 py-1 rounded-lg font-bold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Stock */}
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

          <p className="text-gray-400 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-display font-semibold text-sm text-white mb-3 uppercase tracking-wide">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <span className="text-primary-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs bg-dark-700 text-gray-400 border border-dark-500 px-2.5 py-1 rounded-full"
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
                className={`flex px-6 py-4 ${i % 2 === 0 ? "bg-dark-700/30" : ""}`}
              >
                <span className="text-sm text-gray-400 w-48 flex-shrink-0 font-medium capitalize">
                  {key}
                </span>
                <span className="text-sm text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="section-title mb-8">Customer Reviews</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reviews list */}
          <div className="space-y-4">
            {product.reviews?.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-400">No reviews yet. Be the first!</p>
              </div>
            ) : (
              product.reviews?.map((r) => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{r.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-dark-400"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{r.comment}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write review */}
          {user ? (
            <div className="card p-6">
              <h3 className="font-display font-semibold text-white mb-5">
                Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
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
                          className={`w-7 h-7 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-dark-400 hover:text-yellow-400"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Your Comment
                  </label>
                  <textarea
                    rows={4}
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                    placeholder="Share your experience with this product..."
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
              <p className="text-gray-400 mb-4">Login to write a review</p>
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
