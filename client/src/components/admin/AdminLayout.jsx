import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  LogOut,
  Zap,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isActive = (item) =>
    item.exact
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="px-5 py-6 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span
              className="font-display font-bold text-sm"
              style={{ color: "var(--input-text)" }}
            >
              Dilo's Gadget
            </span>
            <div className="text-xs text-primary-400">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive(item) ? "active" : ""}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{item.label}</span>
            {isActive(item) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
          </Link>
        ))}
      </nav>

      <div
        className="px-3 pb-4 space-y-1 border-t pt-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Link
          to="/"
          className="admin-sidebar-link text-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <Home className="w-4 h-4" /> View Store
        </Link>
        <div
          className="px-4 py-3 rounded-xl border"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--input-text)" }}
          >
            {user?.name}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="admin-sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative w-64 border-r z-10"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2"
            style={{ color: "var(--text-muted)" }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span
            className="font-display font-semibold text-sm"
            style={{ color: "var(--input-text)" }}
          >
            Admin Panel
          </span>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
