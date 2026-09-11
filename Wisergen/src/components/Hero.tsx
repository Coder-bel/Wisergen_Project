import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, UserCheck, Star, Users } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Reliable Support',
    description: 'Always here when you need us',
  },
  {
    icon: UserCheck,
    title: 'Expert Technicians',
    description: 'Certified professionals you can trust',
  },
  {
    icon: Star,
    title: 'Quality Service',
    description: 'Top-notch solutions for every budget',
  },
];

function TrustCard({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 bg-primary-dark/80 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 ${className}`}>
      <div className="w-9 h-9 shrink-0 rounded-full bg-primary-blue flex items-center justify-center">
        <Users size={18} className="text-white" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold">Trusted by Businesses</p>
        <p className="text-gray-400 text-xs leading-snug text-justify">
          Helping startups and enterprises build a stronger digital future
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex items-center bg-gradient-to-br from-primary-dark to-[#1E293B] overflow-hidden min-h-[640px] lg:min-h-screen">
      {/* Photo, anchored right, kept translucent so it blends into the background rather than showing a hard edge */}
      <img
        src="https://i.pinimg.com/1200x/55/d1/f0/55d1f06808ba3d3755320f6d15f7ce4e.jpg"
        alt="IT technician working at a multi-monitor desk"
        className="absolute inset-y-0 right-0 w-full lg:w-3/5 h-full object-cover object-[75%_center] opacity-25 lg:opacity-35"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 55%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 55%, black 100%)',
        }}
      />

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-blue rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-green rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-20 w-full">
        <div className="max-w-2xl animate-fadeInUp">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3 lg:mb-4">
            Welcome to Wisergen Computing
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 lg:mb-6">
            Smart IT Solutions.{' '}
            <span className="text-primary-blue">Stronger Businesses.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xl text-justify">
            We deliver world-class IT solutions to power your needs. From computer
            repairs to advanced networking, CCTV installations, Software Development, Remote IT Support. We've got you
            covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-8 lg:mb-12">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary-blue hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-200 group"
            >
              Our Services
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-transparent border-2 border-white/30 hover:border-white text-white font-medium rounded-full transition-all duration-200"
            >
              Get a Quote
            </Link>
          </div>

          {/* Feature row: icon and title sit on the same line, description underneath */}
          <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-0">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 shrink-0 rounded-lg bg-primary-blue flex items-center justify-center">
                    <Icon size={15} className="text-white" />
                  </div>
                  <p className="text-white text-xs sm:text-sm font-semibold leading-tight">{title}</p>
                </div>
                <p className="text-gray-400 text-[11px] sm:text-xs leading-snug text-justify">{description}</p>
              </div>
            ))}
          </div>

          {/* Trust card sits right under the feature list on mobile; hidden here on desktop, where it floats over the photo instead */}
          <TrustCard className="lg:hidden" />
        </div>
      </div>

      {/* Trusted-by card, floating over the lower part of the photo — desktop only */}
      <TrustCard className="hidden lg:inline-flex absolute bottom-10 right-8 lg:right-12 max-w-xs" />

      <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
}
