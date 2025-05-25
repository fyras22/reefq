"use client";

import { useTranslation } from "@/app/i18n-client";
import { FallbackImage } from "@/components/ui";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeaturesIndexPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { t, i18n } = useTranslation(lang);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL status
    setIsRTL(["ar"].includes(i18n.language));
  }, [i18n.language]);

  // Features data
  const features = [
    {
      id: "3d-visualization",
      name: t("features.3dVisualization.name") || "3D Visualization",
      description:
        t("features.3dVisualization.description") ||
        "Stunning jewelry display allowing customers to see every detail of the piece",
      stat: "+137%",
      statText:
        t("features.3dVisualization.statText") ||
        "increase in customer engagement",
      image: "/images/features/3d-visualization.jpg",
      color: "from-teal-50",
    },
    {
      id: "virtual-try-on",
      name: t("features.arTryOn.name") || "Virtual Try-On",
      description:
        t("features.arTryOn.description") ||
        "Allows customers to virtually try on jewelry, reducing returns",
      stat: "-42%",
      statText: t("features.arTryOn.statText") || "reduction in returns",
      image: "/images/features/virtual-try-on.jpg",
      color: "from-purple-50",
    },
    {
      id: "customize",
      name: t("header.customizeJewelry") || "Customize Jewelry",
      description:
        "Design and create your perfect jewelry piece with our advanced customization tools",
      stat: "+1000",
      statText: "unique combinations",
      image: "/images/features/customize.jpg",
      color: "from-blue-50",
    },
    {
      id: "collections",
      name: t("collections.title") || "Collections",
      description:
        t("collections.description") ||
        "Explore our curated jewelry collections, designed to match your style and occasions",
      stat: "+200",
      statText:
        t("collections.itemCount", { count: 200 }) || "200 unique pieces",
      image: "/images/features/collections.jpg",
      color: "from-rose-50",
    },
    {
      id: "knowledge-hub",
      name: t("header.knowledgeHub") || "Knowledge Hub",
      description:
        "Educational resources to help you understand jewelry craftsmanship and care",
      stat: "+50",
      statText: "jewelry guides and articles",
      image: "/images/features/knowledge-hub.jpg",
      color: "from-violet-50",
    },
    {
      id: "size-optimization",
      name: t("features.sizeOptimization.name") || "Size Optimization",
      description:
        t("features.sizeOptimization.description") ||
        "Advanced algorithms providing accurate size suggestions based on customer data",
      stat: "+89%",
      statText:
        t("features.sizeOptimization.statText") || "increase in size accuracy",
      image: "/images/features/size-optimization.jpg",
      color: "from-amber-50",
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t("features.title") || "Immersive Jewelry Shopping"}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            {t("features.subtitle") ||
              "Transform the customer experience with advanced 3D technologies"}
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                href={`/${lang}/customize`}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 sm:px-8"
              >
                {t("howItWorks.cta") || "Start Designing Now"}
              </Link>
              <Link
                href={`/${lang}/try-and-fit`}
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-nile-teal bg-white border-nile-teal hover:bg-gray-50 sm:px-8"
              >
                {t("header.tryAndFit") || "Try & Fit"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`relative ${index % 2 === 0 ? "" : "lg:flex-row-reverse"} lg:flex lg:items-center lg:gap-16`}
            >
              {/* Image side */}
              <div className="lg:w-1/2">
                <div
                  className={`relative bg-gradient-to-b ${feature.color} to-white rounded-2xl overflow-hidden shadow-xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <FallbackImage
                    src={feature.image}
                    alt={feature.name}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    fallbackSrc="/images/fallback-product.svg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-800">
                      {feature.stat} {feature.statText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="mt-12 lg:mt-0 lg:w-1/2">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {feature.name}
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  {feature.description}
                </p>
                <div className="mt-8">
                  <Link
                    href={`/${lang}/${feature.id}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 transition-colors"
                  >
                    Learn More
                    <ArrowRightIcon className="ml-2 h-5 w-5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-nile-teal">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              The benefits of 3D jewelry visualization
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Our platform provides tangible benefits for jewelry retailers
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Return rate reduction
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                42%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Increase in engagement
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                137%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Conversion increase
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                58%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-teal-100">
                Size accuracy improvement
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                89%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-nile-teal/5 animate-pulse"></div>
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-pharaonic-gold/5 animate-pulse"></div>
          <div className="absolute right-1/4 bottom-1/3 h-40 w-40 rounded-full bg-nile-teal/10"></div>
          <div className="absolute left-1/3 top-1/4 h-24 w-24 rounded-full bg-pharaonic-gold/10"></div>
          <svg
            className="absolute -right-40 -bottom-40 w-96 h-96 text-nile-teal/10"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z" />
          </svg>
          <svg
            className="absolute -left-40 -top-40 w-96 h-96 text-pharaonic-gold/10"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z" />
          </svg>
        </div>

        {/* Badge */}
        <div className="relative flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-nile-teal to-pharaonic-gold text-white text-sm font-medium transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <span className="animate-ping absolute h-3 w-3 rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white mr-2"></span>
            {t("coreFeatures.cta.title") || "Ready to transform your business?"}
          </div>
        </div>

        <div className="relative text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
            Ready to transform your jewelry shopping experience?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            Start using our platform today and provide your customers with an
            immersive jewelry shopping experience
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <Link
              href={`/${lang}/auth/signup`}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md shadow-xl text-white bg-gradient-to-r from-nile-teal to-nile-teal/80 hover:from-nile-teal hover:to-nile-teal transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              {t("header.getStarted") || "Get Started"}
              <ArrowRightIcon className="ml-2 h-5 w-5 text-white" />
            </Link>

            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center justify-center px-8 py-4 border border-nile-teal text-base font-medium rounded-md shadow-md text-nile-teal bg-white hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Contact Sales
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-4 font-medium">
              Trusted by leading jewelry retailers worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="h-8 w-24 grayscale hover:grayscale-0 transition-all duration-500">
                <FallbackImage
                  src="/images/logos/logo-1.svg"
                  alt="LUMINA Jewelry"
                  width={120}
                  height={40}
                  fallbackSrc="/images/fallback-logo.svg"
                />
              </div>
              <div className="h-8 w-20 grayscale hover:grayscale-0 transition-all duration-500">
                <FallbackImage
                  src="/images/logos/logo-2.svg"
                  alt="GEM STUDIO"
                  width={100}
                  height={40}
                  fallbackSrc="/images/fallback-logo.svg"
                />
              </div>
              <div className="h-8 w-28 grayscale hover:grayscale-0 transition-all duration-500">
                <FallbackImage
                  src="/images/logos/logo-3.svg"
                  alt="CROWN jewels"
                  width={140}
                  height={40}
                  fallbackSrc="/images/fallback-logo.svg"
                />
              </div>
              <div className="h-8 w-24 grayscale hover:grayscale-0 transition-all duration-500">
                <FallbackImage
                  src="/images/logos/logo-4.svg"
                  alt="MINIMAL"
                  width={120}
                  height={40}
                  fallbackSrc="/images/fallback-logo.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
