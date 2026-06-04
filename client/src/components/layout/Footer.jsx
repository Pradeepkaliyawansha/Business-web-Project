import { Link } from "react-router-dom";
import { Zap, Globe, X, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span
                className="font-display font-bold text-xl"
                style={{ color: "var(--text-primary)" }}
              >
                Dilo's <span className="text-primary-400">Gadget</span>
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Your premier destination for cutting-edge tech gadgets. We bring
              you the future, today.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[X, Globe, ExternalLink, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:text-primary-400 border"
                  style={{
                    backgroundColor: "var(--bg-surface-2)",
                    borderColor: "var(--border-color-dark)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(249,115,22,0.1)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-surface-2)";
                    e.currentTarget.style.borderColor =
                      "var(--border-color-dark)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4
              className="font-display font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Shop
            </h4>
            <ul className="space-y-2.5">
              {["All Products", "New Arrivals", "Best Sellers", "Deals"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/products"
                      className="text-sm transition-colors hover:text-primary-400"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4
              className="font-display font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Support
            </h4>
            <ul className="space-y-2.5">
              {["About Us", "Contact", "FAQ", "Returns"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors hover:text-primary-400"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-dimmer)" }}>
            © {new Date().getFullYear()} Dilo's Gadget. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-dimmer)" }}>
            Built with ❤️ using MERN Stack + Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
