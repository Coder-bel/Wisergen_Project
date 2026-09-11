import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
export default function CTABanner() {
  return (
    <section className="relative py-14 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#0F172A] to-primary-dark" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-green rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need IT Assistance?
            </h2>
            <p className="text-gray-300 text-lg">
              We are just one call or click away!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            
            <a href="tel:+234906 792 1361"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-4 text-sm sm:text-base bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white font-medium rounded-full transition-colors"
            >
              <Phone size={16} />
              +234 906 792 1361
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary-blue hover:bg-blue-700 text-white font-medium rounded-full transition-all group"
            >
              Get a Quote Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
