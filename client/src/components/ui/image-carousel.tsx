import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ImageCarouselImage {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  link?: string;
}

interface ImageCarouselProps {
  images: ImageCarouselImage[];
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
  fill?: boolean;
}

export function ImageCarousel({
  images,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = "",
  aspectRatio = "video",
  fill = false,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Aspect ratio classes
  const aspectRatioClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/8]",
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  // Handle next image
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle previous image
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Reset timer when index changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (!isPaused && autoPlayInterval > 0) {
      timerRef.current = setTimeout(() => {
        handleNext();
      }, autoPlayInterval);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused, autoPlayInterval]);

  return (
    <div 
      className={`relative overflow-hidden group ${className} ${
        !fill && aspectRatioClasses[aspectRatio]
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className={`absolute inset-0 w-full h-full ${fill ? "object-cover" : ""}`}
        >
          <div className="relative w-full h-full">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            {(images[currentIndex].title || images[currentIndex].subtitle) && (
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
                {images[currentIndex].badge && (
                  <Badge variant="outline" className="bg-blue-500/80 text-white border-none self-start mb-2">
                    {images[currentIndex].badge}
                  </Badge>
                )}
                {images[currentIndex].title && (
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {images[currentIndex].title}
                  </h3>
                )}
                {images[currentIndex].subtitle && (
                  <p className="text-sm md:text-base text-white/80 max-w-2xl text-justify">
                    {images[currentIndex].subtitle}
                  </p>
                )}
                {images[currentIndex].link && (
                  <Button 
                    variant="link" 
                    className="text-white p-0 h-auto mt-2 self-start flex items-center group" 
                    asChild
                  >
                    <a href={images[currentIndex].link} target="_blank" rel="noopener noreferrer">
                      View details
                      <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {showControls && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {showIndicators && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
