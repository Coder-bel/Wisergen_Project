import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'News', path: '/news' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const headerBg = isScrolled || !isHomePage ? 'bg-primary-dark shadow-lg' : 'bg-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Wisergen Computing" className="h-9 sm:h-12 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-primary-blue' : 'text-white hover:text-primary-blue'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block">
              <Link to="/contact" className="inline-flex items-center px-6 py-2.5 bg-primary-blue hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200">
                Get a Quote
              </Link>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white" aria-label="Toggle menu">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 bottom-0 w-72 bg-primary-dark z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-white" aria-label="Close menu"><X size={24} /></button>
          <div className="mt-12">
            <Link to="/" className="flex items-center mb-8">
              <img src="/logo.png" alt="Wisergen Computing" className="h-9 w-auto" />
            </Link>
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`block py-2 text-base font-medium transition-colors ${location.pathname === link.path ? 'text-primary-blue' : 'text-white hover:text-primary-blue'}`}>
                  {link.name}
                </Link>
              ))}
            </nav>
            <Link to="/contact" className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 bg-primary-blue hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors">
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
