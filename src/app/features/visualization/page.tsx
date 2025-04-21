"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { ArrowRightIcon, CubeIcon, DevicePhoneMobileIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";

export default function VisualizationFeature() {
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
              {t("3D Jewelry Visualization")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {t("Experience your jewelry in stunning detail before purchase. Our 3D visualization technology lets you see every angle, texture, and detail of your chosen pieces in realistic rendering.")}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/customize"
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
                src="/images/features/3d-visualization.jpg"
                alt="3D visualization of jewelry"
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
          <h2 className="text-base font-semibold leading-7 text-indigo-400">{t("Powerful Visualization")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("Key Capabilities")}</p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t("Our 3D visualization technology provides an immersive experience to help you make informed decisions about your jewelry.")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <CubeIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                {t("360° Viewing")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Rotate and examine your jewelry from every angle to appreciate its full design and craftsmanship.")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <ViewfinderCircleIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                {t("Zoom & Detail")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Zoom in to see intricate details, settings, and gemstone facets with precision and clarity.")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <DevicePhoneMobileIcon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                {t("Mobile Compatible")}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Experience our 3D visualization on any device, from desktop to mobile, with responsive controls.")}
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">{t("The power of visualization")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("By the numbers")}</p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t("Our 3D visualization technology has transformed how customers experience jewelry online.")}
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
            <dt className="text-sm leading-6 text-gray-300">{t("More Views")}</dt>
            <dd className="order-1 text-5xl font-extrabold text-white">360°</dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
            <dt className="text-sm leading-6 text-gray-300">{t("Increased Engagement")}</dt>
            <dd className="order-1 text-5xl font-extrabold text-white">+78%</dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
            <dt className="text-sm leading-6 text-gray-300">{t("Conversion Rate")}</dt>
            <dd className="order-1 text-5xl font-extrabold text-white">+42%</dd>
          </div>
          <div className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
            <dt className="text-sm leading-6 text-gray-300">{t("Return Rate Reduction")}</dt>
            <dd className="order-1 text-5xl font-extrabold text-white">-35%</dd>
          </div>
        </dl>
      </div>

      {/* Related features section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">{t("Explore More")}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("Related Features")}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t("Discover other powerful features that complement our 3D visualization technology.")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <div className="h-12 w-12 flex-none rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Image
                    src="/images/icons/customize-icon.svg"
                    alt="Customize icon"
                    width={24}
                    height={24}
                    className="text-indigo-400"
                  />
                </div>
                <Link href="/features/customize" className="text-xl hover:text-indigo-300 transition-colors">
                  {t("Jewelry Customization")}
                  <ArrowRightIcon className={`inline-block ml-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                <p className="flex-auto">
                  {t("Design your own unique jewelry pieces by selecting materials, gemstones, and adding personal engravings.")}
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                <div className="h-12 w-12 flex-none rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Image
                    src="/images/icons/virtual-try-on-icon.svg"
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