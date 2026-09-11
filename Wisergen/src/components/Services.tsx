import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Camera, Network, Palette, Headphones, CreditCard } from 'lucide-react';

const services = [
  {
    icon: Monitor,
    title: 'Computer Repair',
    description: 'Expert hardware and software repairs for laptops and desktops. Fast diagnosis and reliable solutions.',
  },
  {
    icon: Camera,
    title: 'CCTV Installation',
    description: 'Professional security camera systems for homes and businesses. Complete setup and monitoring solutions.',
  },
  {
    icon: Network,
    title: 'Networking',
    description: 'Comprehensive network design, installation, and maintenance. LAN, WAN, and wireless solutions.',
  },
  {
    icon: Palette,
    title: 'Graphics Design',
    description: 'Creative design services including logos, branding, marketing materials, and digital graphics.',
  },
  {
    icon: Headphones,
    title: 'IT Support',
    description: 'Round-the-clock technical support and maintenance. Remote and on-site assistance available.',
  },
  {
    icon: CreditCard,
    title: 'POS System Installation & Maintenance',
    description: 'Reliable point-of-sale system setup, configuration, and ongoing maintenance for retail and hospitality businesses.',
  },
];

export default function Services() {
  return (
    <section className="bg-white py-20 lg:py-23">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
            Our Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
            What We Do
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We deliver world-class IT solutions to power your needs.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="w-11 h-11 bg-primary-blue/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-blue transition-colors">
                <service.icon className="w-5 h-5 text-primary-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-dark font-semibold text-base mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3 text-justify">
                {service.description}
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-primary-blue text-sm font-medium hover:gap-2 transition-all"
              >
                Learn More
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
