import { Monitor, Camera, Network, Palette, Headphones, CreditCard, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Monitor,
    title: 'Computer Repair',
    description: 'Expert hardware and software repairs for laptops and desktops. Fast diagnosis and reliable solutions for all makes and models.',
    features: ['Hardware diagnostics', 'Virus removal', 'Data recovery', 'OS installation', 'Upgrades & optimization'],
    image: 'https://i.pinimg.com/736x/3a/d4/14/3ad4140a0df84d47fcd3606523ee1979.jpg',
  },
  {
    icon: Camera,
    title: 'CCTV Installation',
    description: 'Professional security camera systems for homes and businesses. Complete setup, configuration, and monitoring solutions.',
    features: ['IP Cameras', 'DVR/NVR systems', 'Remote monitoring', 'Night vision setup', 'Motion detection'],
    image: 'https://i.pinimg.com/736x/48/40/a5/4840a520566671f11e0fa5ac011c033a.jpg',
  },
  {
    icon: Network,
    title: 'Networking',
    description: 'Comprehensive network design, installation, and maintenance. LAN, WAN, and wireless solutions tailored to your needs.',
    features: ['Network design', 'Cable installation', 'WiFi setup', 'Server configuration', 'Network security'],
    image: 'https://i.pinimg.com/1200x/1e/b1/ff/1eb1ffc9a3288a5cc2f675924ea3ec8d.jpg',
  },
  {
    icon: Palette,
    title: 'Graphics Design',
    description: 'Creative design services including logos, branding, marketing materials, and digital graphics that make your brand stand out.',
    features: ['Logo design', 'Brand identity', 'Print materials', 'Social media graphics', 'Website mockups'],
    image: 'https://i.pinimg.com/1200x/37/81/64/378164d2bd972e592b2e83c298d99652.jpg',
  },
  {
    icon: Headphones,
    title: 'IT Support',
    description: 'Round-the-clock technical support and maintenance. Remote and on-site assistance to keep your systems running smoothly.',
    features: ['24/7 helpdesk', 'Remote support', 'On-site visits', 'System maintenance', 'Consulting'],
    image: 'https://i.pinimg.com/736x/b1/53/d9/b153d9af7720bd4a811be33ea97693b2.jpg',
  },
  {
    icon: CreditCard,
    title: 'POS System Installation & Maintenance',
    description: 'Reliable point-of-sale system setup, configuration, and ongoing maintenance for retail and service businesses.',
    features: ['Hardware setup', 'Software configuration', 'Staff training', 'Receipt & payment integration', 'Ongoing maintenance'],
    image: 'https://i.pinimg.com/1200x/f7/f1/5c/f7f15cb3afdcf6fe9ec211f5cfef5e4f.jpg',
  },
];


export default function ServicesPage() {
  return (
    <div className="pt-20">
      <section className="relative h-96 bg-gradient-to-br from-primary-dark to-[#1E293B] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
            Our Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            What We Offer
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive IT solutions to power your business forward.
          </p>
        </div>
      </section>
 
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                <div className={`grid lg:grid-cols-2 lg:min-h-[26rem] ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`p-8 lg:p-10 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-6">
                      <service.icon className="w-8 h-8 text-primary-blue" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-4 lg:min-h-[4.5rem] flex items-center">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6 text-justify">
                      {service.description}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-accent-green flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-primary-blue font-medium hover:gap-3 transition-all"
                    >
                      Get Started
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <div className={`relative h-64 lg:h-full ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:hidden" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <section className="py-20 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're ready to discuss your specific needs and create a tailored plan for your business.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary-blue hover:bg-blue-700 text-white font-medium rounded-full transition-all group"
          >
            Contact Us Today
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
 
