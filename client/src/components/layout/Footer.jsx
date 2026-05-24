import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Dilo's <span className="text-primary-400">Gadget</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your premier destination for cutting-edge tech gadgets. We bring you the future, today.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-dark-700 hover:bg-primary-500/10 border border-dark-500 hover:border-primary-500/40 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'New Arrivals', 'Best Sellers', 'Deals'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'FAQ', 'Returns'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-dark-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Dilo's Gadget. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">Built with ❤️ using MERN Stack + Vite</p>
        </div>
      </div>
    </footer>
  );
}
