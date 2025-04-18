'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: '/images/avatars/avatar-1.jpg',
    rating: 5,
    jewelry: 'Diamond Solitaire Ring',
    jewelryType: 'ring',
    feedback: 'The AR try-on feature was amazing! I was able to see exactly how the ring looked on my finger before buying. The size calculator was spot on too!',
    date: '2 weeks ago'
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: '/images/avatars/avatar-2.jpg',
    rating: 5,
    jewelry: 'Gold Chain Necklace',
    jewelryType: 'necklace',
    feedback: 'I was skeptical about virtual try-on, but I was blown away by how accurate it was. The necklace I purchased fits perfectly thanks to the size calculator.',
    date: '1 month ago'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    image: '/images/avatars/avatar-3.jpg',
    rating: 4,
    jewelry: 'Pearl Bracelet',
    jewelryType: 'bracelet',
    feedback: 'Being able to try on different bracelets virtually saved me so much time. The measurements were accurate and the bracelet fits perfectly.',
    date: '3 weeks ago'
  },
  {
    id: 4,
    name: 'Daniel Ahmed',
    image: '/images/avatars/avatar-4.jpg',
    rating: 5,
    jewelry: 'Sapphire Earrings',
    jewelryType: 'earring',
    feedback: 'The virtual try-on helped me choose between different earring styles. My wife loves the pair I selected, and they look just like they did in the AR preview!',
    date: '5 days ago'
  }
];

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3 flex items-center justify-center">
            <div className="text-gray-500 text-xs">Photo</div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
            <p className="text-xs text-gray-500">{testimonial.date}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-primary/5 rounded px-3 py-2 mb-4 inline-flex self-start">
        <span className="text-xs font-medium text-primary">
          {testimonial.jewelryType.charAt(0).toUpperCase() + testimonial.jewelryType.slice(1)} - {testimonial.jewelry}
        </span>
      </div>
      
      <p className="text-gray-600 flex-grow">{testimonial.feedback}</p>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">Verified Purchase</span>
        <button className="text-primary text-sm hover:text-primary/80">Read More</button>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Experiences</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See what our customers have to say about our virtual try-on and size calculator tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <button className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
          View All Reviews
        </button>
      </div>
    </div>
  );
} 