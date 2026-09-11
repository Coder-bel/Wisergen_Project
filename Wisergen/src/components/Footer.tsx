import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact Us', path: '/contact' },
];

const services = [
  'Computer Repair',
  'CCTV Installation',
  'Networking',
  'Graphics Design',
  'IT Support',
];

const socialLinks = [
  { icon: Facebook, href: ' https://www.facebook.com/share/17fdCdAefL/ ', label: 'Facebook' },
  { icon: Twitter, href: 'https://x.com/wisergencomp', label: 'Twitter' },
  { icon: Instagram, href: ' https://www.instagram.com/wisergencomputing?igsh=MWE3aXA1aWV2bHNneA==', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Providing reliable IT solutions to help businesses run smarter and more efficiently.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-blue transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to="/services"
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">+234 906 792 1361</p>
                  <p className="text-gray-400 text-sm">+234 903 654 7021</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">info@wisergencomputing.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  46 Lagos-Ibadan Expy, Lagos 110113, Ogun State Nigeria
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Wisergen Computing. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
