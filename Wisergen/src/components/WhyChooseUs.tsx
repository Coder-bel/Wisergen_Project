import { Link } from 'react-router-dom';
import { ArrowRight, Check, Users, Briefcase, Award, Clock } from 'lucide-react';
import CountUp from './CountUp';

const stats = [
  { icon: Users, value: '250+', label: 'Satisfied Clients' },
  { icon: Briefcase, value: '350+', label: 'Projects Completed' },
  { icon: Award, value: '5+', label: 'Years Experience' },
  { icon: Clock, value: '24/7', label: 'Support Available' },
];

const benefits = [
  'Experienced & Certified Professionals',
  'Fast Response & Reliable Support',
  'Quality Workmanship Guaranteed',
  'Affordable & Transparent Pricing',
];

export default function WhyChooseUs() {
  return (
    <section className="bg-primary-dark py-14 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              We are Committed to Delivering the Best
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8 text-justify">
              At Wisergen Computing, we combine expertise, technology, and dedication
              to give you the best IT experience.
            </p>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-accent-green" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary-blue hover:bg-blue-700 text-white font-medium rounded-full transition-all group"
            >
              About Us
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://i.pinimg.com/1200x/ba/98/28/ba9828f1dedbac62fde7444b2aab978a.jpg?auto=compress&cs=tinysrgb&w=800"
                alt="Technician Working"
                className="w-full h-80 lg:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-primary-blue" />
                    <CountUp value={stat.value} className="text-white font-bold text-xl" />
                  </div>
                  <p className="text-gray-300 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
