"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { useState } from "react";
import { useClientTranslation } from "@/utils/i18n";
import { useParams } from "next/navigation";
import i18next from "i18next";

interface ProgramCardProps {
  activity: {
    id: string;
    titleFr: string;
    subtitleFr: string;
    titleNl: string;
    subtitleNl: string;
    imageUrl?: string;
  };
  link?: string;
  translations?: ProgramCardTranslations;
}

interface ProgramCardTranslations {
  individual: {
    button: string;
  };
  learnMore: string;
}

export default function ProgramCard({
  activity,
  link = "#",
  translations,
}: ProgramCardProps) {
  const { lang } = useParams();
  const { t, isLoaded: i18nLoaded } = useClientTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Utiliser directement l'état de chargement du hook useClientTranslation
    if (i18nLoaded && !isLoaded) {
      console.log(`[SponsorshipForm] i18n est chargé, langue: ${lang}`);
      // Vérifier si les traductions sont disponibles
      console.log(`[SponsorshipForm] Test de traduction: ${t("sponsoring.form.form.title")}`);
      console.log(`[SponsorshipForm] Langue courante: ${i18next.language}`);
      console.log(`[SponsorshipForm] Langues disponibles: ${i18next.languages}`);
      setIsLoaded(true);
    }
  }, [i18nLoaded, isLoaded, lang, t]);

  const { id, titleFr, subtitleFr, titleNl, subtitleNl, imageUrl } = activity;

  // Déterminer le titre et la description en fonction de la langue
  const title = lang === "fr" ? titleFr : titleNl;
  const subtitle = lang === "fr" ? subtitleFr : subtitleNl;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-secondary"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Link href={link}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={imageUrl || "/images/hero-player-new.png"}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
        </div>
        <div className="relative p-6">
          <h3 className="text-white mb-2 text-xl font-bold text-white">
            {title}
          </h3>
          <p className="mb-4 text-gray-400">
            {subtitle}
          </p>
          <div className="flex items-center text-primary font-medium">
            {id === "individual" ? (
              <span>{translations?.individual.button}</span>
            ) : (
              <span>{translations?.learnMore}</span>
            )}
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
