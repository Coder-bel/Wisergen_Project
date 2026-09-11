import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Wisergen Computing fixed my laptop the same day and the CCTV installation was top-notch. Highly professional and reliable!",
    author: "Oluremi Bisola",
    role: "Business Owner",
  },
  {
    quote: "The team at Wisergen transformed our entire network infrastructure. Exceptional service and great attention to detail.",
    author: "Adeshina Olayemi",
    role: "IT Manager",
  },
  {
    quote: "Their graphics design work exceeded our expectations. Quick turnaround and very creative solutions.",
    author: "Olagbite Feranmi",
    role: "Marketing Director",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-gray-50 py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-primary-blue text-sm font-medium tracking-widest uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">
              What Our Clients Say
            </h2>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg relative">
              <Quote className="absolute top-8 left-8 w-16 h-16 text-primary-blue/10" />

              <div className="text-center pt-8">
                <p className="text-dark text-xl lg:text-2xl leading-relaxed mb-8">
                  "{testimonials[currentIndex].quote}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-primary-blue rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonials[currentIndex].author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-dark font-semibold">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-primary-blue hover:text-white text-dark transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary-blue' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-primary-blue hover:text-white text-dark transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
