"use client";

import {
  ArrowsRightLeftIcon,
  CameraIcon,
  ChevronLeftIcon,
  HandRaisedIcon,
  InformationCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import PageTransition from "../utils/PageTransition";

// Define a simple translation function type
interface TranslationFunction {
  (key: string): string;
}

interface TryFitFeatureProps {
  t: TranslationFunction;
  isRTL?: boolean;
}

type RingSize = {
  sizeUS: string;
  sizeEU: string;
  sizeDiameter: number;
};

type JewelryItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  model3D: string;
  price: number;
  sizes: RingSize[];
};

const RING_SIZES: RingSize[] = [
  { sizeUS: "4", sizeEU: "47", sizeDiameter: 15 },
  { sizeUS: "4.5", sizeEU: "48", sizeDiameter: 15.3 },
  { sizeUS: "5", sizeEU: "49", sizeDiameter: 15.7 },
  { sizeUS: "5.5", sizeEU: "50", sizeDiameter: 16 },
  { sizeUS: "6", sizeEU: "51.5", sizeDiameter: 16.4 },
  { sizeUS: "6.5", sizeEU: "52.5", sizeDiameter: 16.8 },
  { sizeUS: "7", sizeEU: "54", sizeDiameter: 17.3 },
  { sizeUS: "7.5", sizeEU: "55", sizeDiameter: 17.7 },
  { sizeUS: "8", sizeEU: "57", sizeDiameter: 18.1 },
  { sizeUS: "8.5", sizeEU: "58", sizeDiameter: 18.5 },
  { sizeUS: "9", sizeEU: "59.5", sizeDiameter: 18.9 },
  { sizeUS: "9.5", sizeEU: "60.5", sizeDiameter: 19.3 },
  { sizeUS: "10", sizeEU: "62", sizeDiameter: 19.8 },
  { sizeUS: "10.5", sizeEU: "63", sizeDiameter: 20.2 },
  { sizeUS: "11", sizeEU: "64.5", sizeDiameter: 20.6 },
  { sizeUS: "11.5", sizeEU: "65.5", sizeDiameter: 21 },
  { sizeUS: "12", sizeEU: "67", sizeDiameter: 21.4 },
  { sizeUS: "12.5", sizeEU: "68", sizeDiameter: 21.8 },
  { sizeUS: "13", sizeEU: "69", sizeDiameter: 22.2 },
];

// Sample jewelry items
const SAMPLE_JEWELRY: JewelryItem[] = [
  {
    id: "diamond-engagement-ring",
    name: "Diamond Solitaire Engagement Ring",
    description: "Classic 1.5 carat diamond engagement ring with platinum band",
    image: "/images/jewelry/diamond-ring.webp",
    model3D: "/models/diamond_engagement_ring.glb",
    price: 3499,
    sizes: RING_SIZES,
  },
  {
    id: "gold-wedding-band",
    name: "Classic Gold Wedding Band",
    description: "14K gold wedding band with brushed finish",
    image: "/images/jewelry/gold-band.webp",
    model3D: "/models/gold_wedding_band.glb",
    price: 899,
    sizes: RING_SIZES,
  },
  {
    id: "sapphire-ring",
    name: "Sapphire and Diamond Ring",
    description: "Sapphire center stone with diamond halo and white gold band",
    image: "/images/jewelry/sapphire-ring.webp",
    model3D: "/models/sapphire_ring.glb",
    price: 2799,
    sizes: RING_SIZES,
  },
  {
    id: "emerald-cut-ring",
    name: "Emerald Cut Diamond Ring",
    description: "Sophisticated emerald cut diamond with channel set band",
    image: "/images/jewelry/emerald-cut-ring.webp",
    model3D: "/models/emerald_cut_ring.glb",
    price: 4299,
    sizes: RING_SIZES,
  },
];

type TryFitMethod = "camera" | "hand" | "sizing-guide";
type TryFitStep =
  | "jewelry-selection"
  | "method-selection"
  | "try-on"
  | "results";

export default function TryFitFeature({
  t,
  isRTL = false,
}: TryFitFeatureProps) {
  const [selectedJewelry, setSelectedJewelry] = useState<JewelryItem | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<RingSize | null>(null);
  const [currentStep, setCurrentStep] =
    useState<TryFitStep>("jewelry-selection");
  const [tryOnMethod, setTryOnMethod] = useState<TryFitMethod>("hand");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"US" | "EU">("US");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleSizeUnit = () => {
    setSizeUnit((prev) => (prev === "US" ? "EU" : "US"));
  };

  const handleJewelrySelect = (jewelry: JewelryItem) => {
    setSelectedJewelry(jewelry);
    setCurrentStep("method-selection");
  };

  const handleMethodSelect = (method: TryFitMethod) => {
    setTryOnMethod(method);
    setCurrentStep("try-on");

    if (method === "camera") {
      startCamera();
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback to hand method if camera fails
      setTryOnMethod("hand");
    }
  };

  const stopCamera = () => {
    if (!videoRef.current?.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Process the image for sizing (this would connect to your actual sizing algorithm)
    processSizingImage(canvas);
  };

  const processSizingImage = (canvas: HTMLCanvasElement) => {
    // In a real implementation, this would analyze the image and determine sizing
    // For demo purposes, let's set a "detected" size after a delay
    setIsLoadingModel(true);

    setTimeout(() => {
      // Randomly select a size for demonstration
      const randomSizeIndex = Math.floor(Math.random() * RING_SIZES.length);
      setSelectedSize(RING_SIZES[randomSizeIndex]);
      setIsLoadingModel(false);
      setCurrentStep("results");

      // Stop camera after getting results
      if (tryOnMethod === "camera") {
        stopCamera();
      }
    }, 2500);
  };

  // Handle going back from any step
  const handleBack = () => {
    if (currentStep === "method-selection") {
      setSelectedJewelry(null);
      setCurrentStep("jewelry-selection");
    } else if (currentStep === "try-on") {
      if (isCameraActive) {
        stopCamera();
      }
      setCurrentStep("method-selection");
    } else if (currentStep === "results") {
      setSelectedSize(null);
      setCurrentStep("try-on");
      if (tryOnMethod === "camera") {
        startCamera();
      }
    }
  };

  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive]);

  // Get appropriate size display value based on selected unit
  const getSizeDisplayValue = (size: RingSize) => {
    return sizeUnit === "US" ? size.sizeUS : size.sizeEU;
  };

  // Rendering helper for different steps
  const renderStepContent = () => {
    switch (currentStep) {
      case "jewelry-selection":
        return (
          <PageTransition type="fade">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("tryFit.selectJewelry")}
                </h2>
                <p className="mt-2 text-gray-600">
                  {t("tryFit.selectJewelryDesc")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SAMPLE_JEWELRY.map((jewelry) => (
                  <motion.div
                    key={jewelry.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJewelrySelect(jewelry)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={jewelry.image}
                        alt={jewelry.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {jewelry.name}
                      </h3>
                      <p className="text-nile-teal font-medium">
                        ${jewelry.price.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </PageTransition>
        );

      case "method-selection":
        return (
          <PageTransition type="fade">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("tryFit.selectMethod")}
                </h2>
                <p className="mt-2 text-gray-600">
                  {t("tryFit.selectMethodDesc")}
                </p>
              </div>

              {selectedJewelry && (
                <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={selectedJewelry.image}
                      alt={selectedJewelry.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedJewelry.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedJewelry.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-nile-teal p-6 flex flex-col items-center justify-center text-center"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("camera")}
                >
                  <div className="rounded-full bg-nile-teal/10 p-4 mb-4">
                    <CameraIcon className="h-8 w-8 text-nile-teal" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("tryFit.cameraMethod")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("tryFit.cameraMethodDesc")}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-nile-teal p-6 flex flex-col items-center justify-center text-center"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("hand")}
                >
                  <div className="rounded-full bg-pharaonic-gold/10 p-4 mb-4">
                    <HandRaisedIcon className="h-8 w-8 text-pharaonic-gold" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("tryFit.handMethod")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("tryFit.handMethodDesc")}
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-nile-teal p-6 flex flex-col items-center justify-center text-center"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMethodSelect("sizing-guide")}
                >
                  <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                    <RectangleGroupIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("tryFit.sizeGuideMethod")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("tryFit.sizeGuideMethodDesc")}
                  </p>
                </motion.div>
              </div>
            </div>
          </PageTransition>
        );

      case "try-on":
        return (
          <PageTransition type="fade">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tryOnMethod === "camera"
                    ? t("tryFit.cameraSizing")
                    : tryOnMethod === "hand"
                      ? t("tryFit.handSizing")
                      : t("tryFit.guideSizing")}
                </h2>
                <p className="mt-2 text-gray-600">
                  {tryOnMethod === "camera"
                    ? t("tryFit.cameraSizingDesc")
                    : tryOnMethod === "hand"
                      ? t("tryFit.handSizingDesc")
                      : t("tryFit.guideSizingDesc")}
                </p>
              </div>

              {tryOnMethod === "camera" && (
                <div className="w-full space-y-4">
                  <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />

                    {/* Capture guide overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-dashed border-white rounded-full w-48 h-48 flex items-center justify-center">
                        <div className="text-white text-center bg-black/50 p-2 rounded">
                          {t("tryFit.placeFinger")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    leftIcon={<CameraIcon className="w-5 h-5" />}
                    onClick={captureImage}
                  >
                    {t("tryFit.capture")}
                  </Button>

                  {/* Hidden canvas for image processing */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {tryOnMethod === "hand" && (
                <div className="space-y-6">
                  <div className="relative w-full bg-gray-50 rounded-xl p-4">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src="/images/hand-measuring-guide.svg"
                        alt="Hand measuring guide"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        {t("tryFit.followSteps")}
                      </h3>
                      <ol className="mt-2 space-y-2 list-decimal list-inside text-gray-600">
                        <li>{t("tryFit.handStep1")}</li>
                        <li>{t("tryFit.handStep2")}</li>
                        <li>{t("tryFit.handStep3")}</li>
                        <li>{t("tryFit.handStep4")}</li>
                      </ol>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      // Simulating measurement completion
                      setIsLoadingModel(true);
                      setTimeout(() => {
                        const randomSizeIndex = Math.floor(
                          Math.random() * RING_SIZES.length
                        );
                        setSelectedSize(RING_SIZES[randomSizeIndex]);
                        setIsLoadingModel(false);
                        setCurrentStep("results");
                      }, 2000);
                    }}
                  >
                    {isLoadingModel
                      ? t("tryFit.processing")
                      : t("tryFit.completeHandSizing")}
                  </Button>
                </div>
              )}

              {tryOnMethod === "sizing-guide" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">
                      {t("tryFit.sizeFormat")}
                    </span>
                    <button
                      className="flex items-center space-x-2 text-nile-teal"
                      onClick={toggleSizeUnit}
                    >
                      <span>{sizeUnit}</span>
                      <ArrowsRightLeftIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {RING_SIZES.map((size) => (
                      <motion.button
                        key={size.sizeUS}
                        className="p-3 border-2 rounded-lg text-center hover:border-nile-teal hover:bg-nile-teal/5 focus:outline-none focus:ring-2 focus:ring-nile-teal"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedSize(size);
                          setCurrentStep("results");
                        }}
                      >
                        <span className="block text-lg font-medium">
                          {getSizeDisplayValue(size)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {size.sizeDiameter}mm
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                    <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-700">
                        {t("tryFit.sizeInfo")}
                      </h4>
                      <p className="mt-1 text-sm text-blue-600">
                        {t("tryFit.sizeInfoDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PageTransition>
        );

      case "results":
        return (
          <PageTransition type="fade">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("tryFit.results")}
                </h2>
                <p className="mt-2 text-gray-600">{t("tryFit.resultsDesc")}</p>
              </div>

              {selectedJewelry && selectedSize && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-nile-teal/10 to-pharaonic-gold/10 rounded-xl p-6">
                    <div className="text-center space-y-2">
                      <p className="text-gray-600">
                        {t("tryFit.recommendedSize")}
                      </p>
                      <div className="flex justify-center items-center space-x-4">
                        <span className="text-4xl font-bold text-nile-teal">
                          {getSizeDisplayValue(selectedSize)}
                        </span>
                        <div className="bg-white px-3 py-1 rounded-full text-xs font-medium">
                          {sizeUnit === "US"
                            ? `${selectedSize.sizeEU} EU`
                            : `${selectedSize.sizeUS} US`}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedSize.sizeDiameter}mm {t("tryFit.diameter")}
                      </p>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={toggleSizeUnit}
                        className="flex items-center space-x-1 text-sm text-nile-teal"
                      >
                        <ArrowsRightLeftIcon className="h-4 w-4" />
                        <span>{t("tryFit.toggleSizeFormat")}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                      <h3 className="font-medium text-gray-900">
                        {selectedJewelry.name}
                      </h3>
                    </div>
                    <div className="p-4 flex items-center space-x-4">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={selectedJewelry.image}
                          alt={selectedJewelry.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {selectedJewelry.description}
                        </p>
                        <p className="text-nile-teal font-medium mt-1">
                          ${selectedJewelry.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="default"
                      size="lg"
                      fullWidth
                      onClick={() => {
                        console.log("Add to cart clicked");
                        // Add to cart logic
                      }}
                    >
                      {t("tryFit.addToCart")}
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onClick={() => {
                        console.log("View details clicked");
                        // View details logic
                      }}
                    >
                      {t("tryFit.viewDetails")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </PageTransition>
        );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      {/* Header with back button */}
      {currentStep !== "jewelry-selection" && (
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-nile-teal transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            <span>{t("tryFit.back")}</span>
          </button>
        </div>
      )}

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoadingModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-xl max-w-sm w-full text-center">
              <div className="w-16 h-16 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900">
                {t("tryFit.processing")}
              </h3>
              <p className="mt-2 text-gray-600">{t("tryFit.processingDesc")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {["jewelry-selection", "method-selection", "try-on", "results"].map(
            (step, index) => (
              <React.Fragment key={step}>
                {/* Step dot */}
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-nile-teal text-white"
                      : index <
                          [
                            "jewelry-selection",
                            "method-selection",
                            "try-on",
                            "results",
                          ].indexOf(currentStep)
                        ? "bg-nile-teal/20 text-nile-teal"
                        : "bg-gray-200 text-gray-500"
                  }`}
                  initial={false}
                  animate={{
                    scale: currentStep === step ? 1.1 : 1,
                  }}
                >
                  {index + 1}
                </motion.div>

                {/* Connector line */}
                {index < 3 && (
                  <div className="flex-1 h-1 mx-2">
                    <div
                      className={`h-full ${
                        index <
                        [
                          "jewelry-selection",
                          "method-selection",
                          "try-on",
                          "results",
                        ].indexOf(currentStep)
                          ? "bg-nile-teal"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{t("tryFit.step1Short")}</span>
          <span>{t("tryFit.step2Short")}</span>
          <span>{t("tryFit.step3Short")}</span>
          <span>{t("tryFit.step4Short")}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {renderStepContent()}
      </div>
    </div>
  );
}
