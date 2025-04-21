"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/language-switcher';

export default function Header({ 
  dictionary,
  lang
}: { 
  dictionary: Record<string, any>;
  lang: string;
}) {
  const pathname = usePathname();
  
  const t = (key: string): string => {
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
      }, obj);
    };
    
    return getNestedValue(dictionary, key) || key;
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-secondary/90 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="relative h-10 w-auto">
              <Image
                src="/images/befa-logo.png"
                alt="BEFA Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {t("header.home")}
            </Link>
            <Link
              href={`/${lang}/activites`}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {t("header.activities")}
            </Link>
            <Link
              href={`/${lang}/sponsoring`}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {t("header.sponsoring")}
            </Link>
            <Link
              href={`/${lang}/galerie`}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {t("header.gallery")}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {t("header.contact")}
            </Link>
          </nav>

          {/* Location & Language */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              <span>KSC Grimbergen</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm text-gray-300 hover:text-primary transition-colors">
                  <Globe className="h-4 w-4 mr-1 text-primary" />
                  <span>{lang.toUpperCase()}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-secondary text-gray-300 border-gray-700"
              >
                <DropdownMenuItem
                  className={`hover:text-primary hover:bg-gray-800 ${
                    lang === "fr" ? "text-primary" : ""
                  }`}
                >
                  <Link href={pathname.replace(/^\/[^\/]+/, '/fr')}>
                    Français
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`hover:text-primary hover:bg-gray-800 ${
                    lang === "nl" ? "text-primary" : ""
                  }`}
                >
                  <Link href={pathname.replace(/^\/[^\/]+/, '/nl')}>
                    Nederlands
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              asChild
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              <Link href={`/${lang}/inscription`}>{t("header.register")}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-secondary/95 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container px-4 py-6 flex flex-col gap-4">
              <Link
                href={`/${lang}`}
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.home")}
              </Link>
              <Link
                href={`/${lang}/activites`}
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.activities")}
              </Link>
              <Link
                href={`/${lang}/sponsoring`}
                className="text-sm font-medium text-gray-300 hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.sponsoring")}
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-gray-300">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  <span>KSC Grimbergen</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-sm text-gray-300 hover:text-primary transition-colors">
                      <Globe className="h-4 w-4 mr-1 text-primary" />
                      <span className="uppercase">{lang}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-secondary text-gray-300 border-gray-700"
                  >
                    <DropdownMenuItem
                      className={`hover:text-primary hover:bg-gray-800 ${
                        lang === "fr" ? "text-primary" : ""
                      }`}
                    >
                      <Link href={pathname.replace(/^\/[^\/]+/, '/fr')}>
                        Français
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`hover:text-primary hover:bg-gray-800 ${
                        lang === "nl" ? "text-primary" : ""
                      }`}
                    >
                      <Link href={pathname.replace(/^\/[^\/]+/, '/nl')}>
                        Nederlands
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                asChild
                className="bg-primary text-secondary hover:bg-primary/90 w-full mt-2"
              >
                <Link href={`/${lang}/inscription`}>{t("header.register")}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
