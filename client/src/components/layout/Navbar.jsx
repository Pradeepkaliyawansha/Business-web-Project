import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Zap, User, LogOut, ShieldCheck, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-2xl shadow-black/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-400 transition-colors shadow-lg shadow-primary-500/30">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span
              className="font-display font-bold text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              Dilo's <span className="text-primary-400">Gadget</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  location.pathname === link.href
                    ? "text-primary-400 bg-primary-500/10"
                    : "hover:bg-primary-500/5"
                }`}
                style={
                  location.pathname !== link.href
                    ? { color: "var(--text-muted)" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (location.pathname !== link.href)
                    e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.href)
                    e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/products")}
              className="p-2 rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Search className="w-5 h-5" />
            </button>

            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color-dark)",
                  }}
                >
                  <div className="w-7 h-7 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-400" />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--input-text)" }}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                  {user.role === "admin" && (
                    <span className="badge-orange text-xs">Admin</span>
                  )}
                </button>

                {userDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl shadow-black/20 overflow-hidden animate-slide-down border"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div
                      className="p-3 border-b"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--input-text)" }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {user.email}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-primary-400 hover:bg-primary-500/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden glass border-t animate-slide-down"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                  location.pathname === link.href
                    ? "text-primary-400 bg-primary-500/10"
                    : "hover:bg-primary-500/5"
                }`}
                style={
                  location.pathname !== link.href
                    ? { color: "var(--text-muted)" }
                    : {}
                }
              >
                {link.label}
              </Link>
            ))}
            <div
              className="pt-3 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              {user ? (
                <>
                  <div
                    className="px-4 py-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Signed in as{" "}
                    <span style={{ color: "var(--input-text)" }}>
                      {user.name}
                    </span>
                  </div>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-primary-400 hover:bg-primary-500/10 rounded-xl"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="btn-secondary text-center">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-center">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
