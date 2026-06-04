import { Link } from "react-router-dom";
import { Star, ShoppingCart, Zap } from "lucide-react";

export default function ProductCard({ product }) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;
  const mainImage = product.images?.[0]?.url;

  return (
    <Link
      to={`/products/${product._id}`}
      className="card-hover group block animate-fade-in"
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: "var(--bg-surface-2)" }}
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap
              className="w-16 h-16"
              style={{ color: "var(--border-color-dark)" }}
            />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs">
              ⭐ Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30 text-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick action */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/40">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
            {product.category.icon} {product.category.name}
          </span>
        )}
        <h3
          className="font-display font-semibold mt-1 line-clamp-2 group-hover:text-primary-300 transition-colors text-sm leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {product.name}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-dimmer)" }}>
          {product.brand}
        </p>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : ""}`}
                  style={
                    i >= Math.round(product.rating)
                      ? { color: "var(--border-color-dark)" }
                      : {}
                  }
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--text-dimmer)" }}>
              ({product.numReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className="font-display font-bold text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span
              className="text-sm line-through"
              style={{ color: "var(--text-dimmer)" }}
            >
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
