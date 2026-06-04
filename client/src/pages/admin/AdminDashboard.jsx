import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Package, Tag, TrendingUp, ArrowRight } from "lucide-react";
import api from "../../utils/api";
import { PageLoader } from "../../components/common/Loader";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/dashboard/stats")
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const statCards = [
    {
      label: "Total Products",
      value: data?.stats.totalProducts ?? 0,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      link: "/admin/products",
    },
    {
      label: "Categories",
      value: data?.stats.totalCategories ?? 0,
      icon: Tag,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      link: "/admin/categories",
    },
    {
      label: "Registered Users",
      value: data?.stats.totalUsers ?? 0,
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      link: "/admin/users",
    },
    {
      label: "Active Listings",
      value: data?.stats.totalProducts ?? 0,
      icon: TrendingUp,
      color: "text-primary-400",
      bg: "bg-primary-500/10 border-primary-500/20",
      link: "/admin/products",
    },
  ];

  return (
    <div className="animate-fade-in max-w-6xl">
      <div className="mb-8">
        <h1
          className="font-display font-bold text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Welcome back! Here's what's happening.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link
            key={label}
            to={link}
            className={`card p-5 border ${bg} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`w-5 h-5 ${color}`} />
              <ArrowRight className={`w-4 h-4 ${color} opacity-60`} />
            </div>
            <div
              className="font-display font-bold text-3xl mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="card">
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <h2
              className="font-display font-semibold flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Package className="w-4 h-4 text-primary-400" /> Recent Products
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "var(--border-color)" }}
          >
            {data?.recentProducts?.length === 0 ? (
              <p
                className="p-5 text-sm text-center"
                style={{ color: "var(--text-dimmer)" }}
              >
                No products yet
              </p>
            ) : (
              data?.recentProducts?.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                  style={{ borderColor: "var(--border-color)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--bg-surface)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ backgroundColor: "var(--bg-surface-2)" }}
                  >
                    {p.category?.icon || "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-dimmer)" }}
                    >
                      {p.category?.name}
                    </p>
                  </div>
                  <div className="text-sm font-display font-bold text-primary-400">
                    ${p.price?.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <h2
              className="font-display font-semibold flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Users className="w-4 h-4 text-primary-400" /> Recent Users
            </h2>
            <Link
              to="/admin/users"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "var(--border-color)" }}
          >
            {data?.recentUsers?.length === 0 ? (
              <p
                className="p-5 text-sm text-center"
                style={{ color: "var(--text-dimmer)" }}
              >
                No users yet
              </p>
            ) : (
              data?.recentUsers?.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--bg-surface)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-400 font-bold text-sm">
                      {u.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {u.name}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--text-dimmer)" }}
                    >
                      {u.email}
                    </p>
                  </div>
                  <span
                    className={`badge text-xs ${u.role === "admin" ? "badge-orange" : "badge-gray"}`}
                  >
                    {u.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <h2
          className="font-display font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products/new" className="btn-primary text-sm py-2.5">
            + Add Product
          </Link>
          <Link to="/admin/categories" className="btn-secondary text-sm py-2.5">
            Manage Categories
          </Link>
          <Link to="/admin/users" className="btn-secondary text-sm py-2.5">
            View Users
          </Link>
          <Link to="/" target="_blank" className="btn-ghost text-sm py-2.5">
            View Store ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
