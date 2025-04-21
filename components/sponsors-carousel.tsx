"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Données des sponsors (à remplacer par vos propres sponsors)
const sponsors = [
  {
    id: 1,
    name: "Snack Dewand",
    logo: "/images/sponsors/snack_dewand.png",
    website: "https://www.snackdewand.com",
  },
  {
    id: 2,
    name: "Alba Group",
    logo: "/images/sponsors/alba_group.png",
    website: "https://www.albagroup.be/",
  },
  {
    id: 3,
    name: "Moupress",
    logo: "/images/sponsors/moupress.png",
    website: "https://www.moupress.be/",
  },
  {
    id: 4,
    name: "Karbill",
    logo: "/images/sponsors/karbill.png",
    website: "https://www.karbill.be/",
  },
];

export default function SponsorsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 2 : 4; // Nombre de sponsors visibles à la fois
  const maxIndex = Math.max(0, sponsors.length - itemsPerPage);

  // Gestion du défilement automatique
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoplay, maxIndex]);

  // Navigation
  const next = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Contrôles de navigation */}
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-secondary/50 text-white hover:bg-secondary/80"
          onClick={prev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Précédent</span>
        </Button>
      </div>

      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-secondary/50 text-white hover:bg-secondary/80"
          onClick={next}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Suivant</span>
        </Button>
      </div>

      {/* Carrousel */}
      <div className="relative overflow-hidden px-10">
        <motion.div
          ref={carouselRef}
          className="flex"
          animate={{ x: `calc(-${currentIndex * (100 / itemsPerPage)}%)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className={`flex w-full shrink-0 ${
                isMobile ? "basis-1/2" : "basis-1/4"
              } flex-col items-center px-4 py-2`}
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              <Link
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-24 w-full items-center justify-center rounded-lg  p-4 transition-all"
              >
                <Image
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={sponsor.name}
                  width={300}
                  height={100}
                  className="max-h-16 w-auto object-contain opacity-70 transition-opacity group-hover:opacity-100"
                />
              </Link>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicateurs */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-gray-600"
            }`}
            onClick={() => {
              setAutoplay(false);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
