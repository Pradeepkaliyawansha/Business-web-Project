import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Headphones,
  ChevronRight,
} from "lucide-react";
import api from "../../utils/api";
import ProductCard from "../../components/common/ProductCard";
import { PageLoader } from "../../components/common/Loader";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products?featured=true&limit=8"),
          api.get("/categories"),
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const perks = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: Shield, title: "2-Year Warranty", desc: "On all products" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
    { icon: Zap, title: "Fast Delivery", desc: "2-3 business days" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-xs text-primary-400 font-medium tracking-wide uppercase">
                  New Arrivals Available
                </span>
              </div>

              <h1
                className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-none mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                The Future of <span className="gradient-text">Tech</span>
                <br />
                Is Here
              </h1>

              <p
                className="text-lg leading-relaxed mb-8 max-w-md"
                style={{ color: "var(--text-muted)" }}
              >
                Discover the latest gadgets and electronics at Dilo's Gadget.
                Premium quality, competitive prices, and unmatched support.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="btn-primary flex items-center gap-2 text-base"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="btn-secondary flex items-center gap-2 text-base"
                >
                  Featured Deals
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12">
                {[
                  ["500+", "Products"],
                  ["10K+", "Happy Customers"],
                  ["4.9★", "Avg Rating"],
                ].map(([val, label]) => (
                  <div key={label}>
                    <div
                      className="font-display font-bold text-2xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {val}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-dimmer)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-primary-500/5 rounded-full border border-primary-500/10 flex items-center justify-center animate-glow">
                  <div className="w-56 h-56 bg-primary-500/10 rounded-full border border-primary-500/20 flex items-center justify-center">
                    <div className="w-32 h-32 bg-primary-500/20 rounded-full border border-primary-500/30 flex items-center justify-center">
                      <Zap className="w-16 h-16 text-primary-400 fill-primary-400" />
                    </div>
                  </div>
                </div>
                {[
                  {
                    label: "Latest Tech",
                    sub: "Smartphones & More",
                    pos: "-top-4 -left-8",
                  },
                  {
                    label: "Best Deals",
                    sub: "Up to 40% off",
                    pos: "-bottom-4 -right-8",
                  },
                ].map(({ label, sub, pos }) => (
                  <div
                    key={label}
                    className={`absolute ${pos} rounded-2xl p-4 shadow-2xl border`}
                    style={{
                      backgroundColor: "var(--hero-card-bg)",
                      borderColor: "var(--hero-card-border)",
                    }}
                  >
                    <div
                      className="font-display font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {label}
                    </div>
                    <div className="text-xs text-primary-400 mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section
        className="border-y"
        style={{
          backgroundColor: "var(--perk-bg)",
          borderColor: "var(--perk-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div
                    className="font-display font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {title}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-dimmer)" }}
                  >
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">
                Browse By
              </p>
              <h2 className="section-title">Categories</h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm hover:text-primary-400 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="card-hover p-5 text-center group"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3
                  className="font-display font-semibold text-sm group-hover:text-primary-400 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cat.name}
                </h3>
                {cat.description && (
                  <p
                    className="text-xs mt-1 line-clamp-1"
                    style={{ color: "var(--text-dimmer)" }}
                  >
                    {cat.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">
                Hand-Picked
              </p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link
              to="/products?featured=true"
              className="flex items-center gap-1 text-sm hover:text-primary-400 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative bg-gradient-to-br from-primary-500/20 to-primary-700/10 border border-primary-500/20 rounded-3xl overflow-hidden p-10 lg:p-16 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-50" />
          <div className="relative">
            <h2
              className="font-display font-bold text-4xl lg:text-5xl mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to Upgrade?
            </h2>
            <p
              className="text-lg mb-8 max-w-md mx-auto"
              style={{ color: "var(--text-muted)" }}
            >
              Join thousands of tech enthusiasts who trust Dilo's Gadget for
              their premium tech needs.
            </p>
            <Link
              to="/register"
              className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
