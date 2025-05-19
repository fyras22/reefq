"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TFunction } from "i18next";
import { useState } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface TestimonialsSectionProps {
  t: TFunction;
  isRTL: boolean;
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  t,
  isRTL,
  testimonials,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t("testimonials.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t("testimonials.subtitle")}
          </motion.p>
        </div>

        <div className="mt-16 relative">
          <div className="relative h-96 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  x:
                    currentIndex === index
                      ? 0
                      : currentIndex > index
                        ? -100
                        : 100,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="mx-auto max-w-3xl text-center">
                  <svg
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-xl font-medium text-gray-900 md:text-2xl">
                    {testimonial.quote}
                  </p>
                  <div className="mt-8">
                    <div className="md:flex md:items-center md:justify-center">
                      <div className="mt-3 text-center md:mt-0 md:flex md:items-center">
                        <div className="text-base font-medium text-gray-900">
                          {testimonial.author}
                        </div>
                        <svg
                          className="hidden md:block mx-1 h-5 w-5 text-nile-teal"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11 0h3v20h-3V0zM6 0h3v20H6V0z" />
                        </svg>
                        <div className="text-base font-medium text-gray-500">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="absolute top-1/2 w-full flex justify-between items-center transform -translate-y-1/2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-nile-teal"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-nile-teal"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Indicator dots */}
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-nile-teal" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Logos section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <p className="text-center text-base font-semibold text-gray-500">
            {t("testimonials.trustedBy")}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-12 grayscale"
                src="/images/logos/logo-1.svg"
                alt="Company 1"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-12 grayscale"
                src="/images/logos/logo-2.svg"
                alt="Company 2"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-12 grayscale"
                src="/images/logos/logo-3.svg"
                alt="Company 3"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-12 grayscale"
                src="/images/logos/logo-4.svg"
                alt="Company 4"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
