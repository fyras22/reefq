'use client'; // Uses motion

import { motion } from 'framer-motion';
import { TFunction } from 'i18next';

// Define the structure of a testimonial item
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface TestimonialsSectionProps {
  t: TFunction;
  isRTL: boolean; // Although not used in this specific JSX, keep for consistency if needed later
  testimonials: Testimonial[]; // Pass the testimonials array
}

export function TestimonialsSection({ t, isRTL, testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-lg font-medium uppercase tracking-wider text-pharaonic-gold">{t('testimonials.title')}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal sm:text-4xl font-serif">
            {t('testimonials.subtitle')}
          </h2>
        </div>

        {/* Commented out success stories imagery - can be added back if needed */}
        {/* <div className="mt-10 mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          ...
        </div> */}

        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author} // Use a unique key like author
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col justify-between bg-bg-light p-8 rounded-2xl shadow-lg ring-1 ring-gray-200"
              >
                <div className="mb-6">
                  {/* Quotation Mark SVG */}
                  <svg className="h-8 w-8 text-pharaonic-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                </div>
                <blockquote className="text-lg leading-relaxed text-gray-700 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-pharaonic-gold">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 