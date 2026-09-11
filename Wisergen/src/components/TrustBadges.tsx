import { Award, CheckCircle, DollarSign, Headphones, Users } from 'lucide-react';

const badges = [
  {
    icon: Award,
    title: 'Expert Technicians',
    subtitle: 'Certified professionals',
  },
  {
    icon: CheckCircle,
    title: 'Quality Service',
    subtitle: 'Top-notch solutions',
  },
  {
    icon: DollarSign,
    title: 'Affordable Pricing',
    subtitle: 'Budget-friendly rates',
  },
  {
    icon: Headphones,
    title: 'Quick Support',
    subtitle: '24/7 availability',
  },
  {
    icon: Users,
    title: 'Customer Satisfaction',
    subtitle: 'Happy clients',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 bg-primary-blue/10 rounded-xl flex items-center justify-center mb-3">
                <badge.icon className="w-7 h-7 text-primary-blue" />
              </div>
              <h3 className="text-dark font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-gray-500 text-xs">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
