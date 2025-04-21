"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/app/i18n-client";
import { 
  ArrowRightIcon, 
  ScaleIcon, 
  FingerPrintIcon, 
  ArrowsPointingOutIcon 
} from "@heroicons/react/24/outline";

export default function MeasurementsFeature() {
  const { t } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  return (
    <div className="bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>
        <div
          className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  {t("feature")}
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {t("Precision Jewelry Measurements")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {t("Find your perfect fit with our advanced measurement tools. Our technology ensures the jewelry you order will fit perfectly, whether it's a ring, bracelet, or necklace.")}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/try-and-fit"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                {t("Try It Now")}
              </Link>
              <Link href="/collections" className="text-sm font-semibold leading-6 text-white">
                {t("View Collections")} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <Image
                src="/images/features/size-calculator.jpg"
                alt="Jewelry size calculator interface"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">{t("Measurement Technology")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("Multiple Methods for Accuracy")}</p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t("Choose from multiple measurement methods to find your perfect size with confidence.")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <ScaleIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                {t("Virtual Ruler")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Use our on-screen calibrated ruler to measure your finger, wrist, or neck with precision, all from your device.")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <FingerPrintIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                {t("Manual Input")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Already know your measurements? Simply enter your circumference or diameter for immediate sizing recommendations.")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <ArrowsPointingOutIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                {t("Size Guide")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Browse our comprehensive size charts for rings, bracelets, and necklaces to cross-reference international sizing standards.")}
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Sizing tables */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">{t("Sizing Guide")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("International Size Standards")}</p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t("Our sizing system adheres to international standards, ensuring consistency across all jewelry types.")}
          </p>
        </div>

        <div className="mt-16 overflow-hidden bg-white/5 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-white">{t("Ring Size Chart")}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-300">{t("US, EU, and UK sizing with corresponding measurements")}</p>
          </div>
          <div className="border-t border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t("US Size")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t("EU Size")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t("UK Size")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t("Diameter (mm)")}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t("Circumference (mm)")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">4</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">47</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">H</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">14.9</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">46.8</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">49</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">J 1/2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">15.7</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">49.3</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">6</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">51-52</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">L 1/2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">16.5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">51.9</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">7</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">54</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">N 1/2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">17.3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">54.4</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">8</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">57</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">P 1/2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">18.1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">56.9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden bg-white/5 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-white">{t("Bracelet Size Chart")}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-300">{t("Standard bracelet sizes and wrist measurements")}</p>
            </div>
            <div className="border-t border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Size")}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Wrist (in)")}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Wrist (cm)")}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Bracelet (cm)")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">XS</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">5.5-6.0</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">14.0-15.2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">15.2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">S</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">6.0-6.5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">15.2-16.5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">16.5</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">6.5-7.0</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">16.5-17.8</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">17.8</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">L</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">7.0-7.5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">17.8-19.0</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">19.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white/5 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-white">{t("Necklace Size Chart")}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-300">{t("Standard necklace lengths and styles")}</p>
            </div>
            <div className="border-t border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Length")}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Inches")}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Centimeters")}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {t("Style")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">14"</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">14</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">35.6</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t("Collar")}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">16"</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">16</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">40.6</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t("Choker")}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">18"</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">18</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">45.7</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t("Princess")}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">20-24"</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">20-24</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">50.8-61.0</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t("Matinee")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related features section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">{t("Explore More")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("Related Features")}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t("Discover other powerful features that complement our sizing tools.")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <div className="h-12 w-12 flex-none rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Image
                    src="/images/icons/visualization-icon.svg"
                    alt="3D visualization icon"
                    width={24}
                    height={24}
                    className="text-indigo-400"
                  />
                </div>
                <Link href="/features/visualization" className="text-xl hover:text-indigo-300 transition-colors">
                  {t("3D Visualization")}
                  <ArrowRightIcon className={`inline-block ml-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Experience jewelry in stunning 3D detail, examining every angle and feature before you purchase.")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <div className="h-12 w-12 flex-none rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Image
                    src="/images/icons/try-on-icon.svg"
                    alt="Virtual try-on icon"
                    width={24}
                    height={24}
                    className="text-indigo-400"
                  />
                </div>
                <Link href="/features/virtual-try-on" className="text-xl hover:text-indigo-300 transition-colors">
                  {t("Virtual Try-On")}
                  <ArrowRightIcon className={`inline-block ml-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("See how jewelry pieces look on you using augmented reality technology before making a purchase.")}
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 