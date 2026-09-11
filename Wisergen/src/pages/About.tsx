import { Users, Briefcase, Award, Clock, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from '../components/CountUp';

const stats = [
  { icon: Award, value: '5+', label: 'Years Experience' },
  { icon: Users, value: '250+', label: 'Satisfied Clients' },
  { icon: Briefcase, value: '350+', label: 'Projects Completed' },
  { icon: Clock, value: '24/7', label: 'Support Available' },
];

const values = [
  {
    title: 'Excellence',
    description: 'We strive for excellence in every project we undertake.',
  },
  {
    title: 'Integrity',
    description: 'We build trust through honesty and transparent communication.',
  },
  {
    title: 'Innovation',
    description: 'We embrace new technologies to deliver cutting-edge solutions.',
  },
  {
    title: 'Customer Focus',
    description: 'Your satisfaction is our top priority in everything we do.',
  },
];

export default function About() {
  return (
    <div className="pt-20">
      <section className="relative h-96 bg-gradient-to-br from-primary-dark to-[#1E293B] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our Story
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Building stronger businesses through reliable IT solutions since 2019.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-2xl"
              >
                <stat.icon className="w-10 h-10 text-primary-blue mx-auto mb-3" />
                <CountUp value={stat.value} className="text-3xl font-bold text-dark block" />
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
                Our Story
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                Professional IT Services You Can Trust
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-justify">
                Wisergen Computing was founded with a simple mission: to provide
                reliable, professional IT services that help businesses thrive. Based
                in Mowe, Ogun State, Nigeria, we have grown from a small repair shop to
                a comprehensive IT solutions provider.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-justify">
                Our team of certified technicians and creative professionals brings
                years of experience in computer repair, network installation, security
                systems, and graphic design. We treat every project with the same
                dedication we would want for our own businesses.
              </p>
              <ul className="space-y-4">
                {['Certified & experienced professionals', 'Quality workmanship guaranteed', 'Fast response times', 'Transparent, competitive pricing'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-accent-green" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/42/77/6f/42776f7c425601e1a0a9a12dd2d4074e.jpg?auto=compress&cs=tinysrgb&w=800"
                alt="Team working together"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
              Our Values
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">
              What Drives Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-blue font-bold text-xl">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-dark font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let us help you solve your IT challenges with professionalism and expertise.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary-blue hover:bg-blue-700 text-white font-medium rounded-full transition-all group"
          >
            Get in Touch
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
