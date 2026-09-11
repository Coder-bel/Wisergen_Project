import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    title: '5 Signs Your Laptop Needs Professional Repair',
    excerpt: 'Learn the warning signs that indicate your laptop needs expert attention before the problem gets worse.',
    image: 'https://i.pinimg.com/736x/22/c3/ab/22c3ab33190847e66df88718a9e3e9da.jpg',
    date: 'Dec 15, 2024',
    category: 'Computer Repair',
  },
  {
    title: 'Benefits of Installing CCTV for Your Business',
    excerpt: 'Discover how security cameras can protect your business, reduce theft, and provide peace of mind.',
    image: 'https://i.pinimg.com/736x/2a/0c/b6/2a0cb6c4f18a43ca29c51da284de4955.jpg',
    date: 'Dec 10, 2024',
    category: 'CCTV',
  },
  {
    title: 'Essential Networking Tips for Small Businesses',
    excerpt: 'Optimize your business network with these practical tips for better performance and security.',
    image: 'https://i.pinimg.com/736x/0a/19/e0/0a19e078b66ea380bed44f4890195a69.jpg',
    date: 'Dec 5, 2024',
    category: 'Networking',
  },
];

export default function Blog() {
  return (
    <div className="pt-20">
      <section className="relative h-96 bg-gradient-to-br from-primary-dark to-[#1E293B] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
            Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Latest Articles & Tips
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Insights and guides to help you make the most of your technology.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-blue text-white text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-dark font-semibold text-lg mb-2 group-hover:text-primary-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
