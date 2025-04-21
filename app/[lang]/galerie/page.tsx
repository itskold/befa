import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/gallery-grid";
import { galleryService } from "@/lib/firebaseService";
import { GalleryCategory } from "@/lib/types";
import { getI18n } from '@/utils/server-i18n';
import ClientGallery from "@/components/client-gallery";

// Type pour les images formatées pour l'affichage dans la grille
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  description?: string;
}

export default async function GalleryPage({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await getI18n(lang) as { t: (key: string) => string };
  
  // Récupération des données côté serveur
  const fetchedCategories = await galleryService.getAll();
  
  // Transformer les données pour correspondre à la structure attendue par le composant
  const formattedImages: GalleryImage[] = [];
  let imageCounter = 1;
  
  fetchedCategories.forEach(category => {
    // Vérifier si le tableau d'images existe
    if (category.images && Array.isArray(category.images)) {
      category.images.forEach(imageUrl => {
        formattedImages.push({
          id: imageCounter++,
          src: imageUrl,
          alt: lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr,
          category: lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr,
          description: lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr
        });
      });
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              {t("gallery.hero.title1")} <span className="text-primary">{t("gallery.hero.title2")}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t("gallery.hero.description")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Passer les données au composant client */}
      <ClientGallery 
        images={formattedImages} 
        categories={fetchedCategories} 
        lang={lang}
        translations={{
          all: t("gallery.filters.all"),
          loading: t("gallery.loading")
        }}
      />

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className=" text-3xl md:text-4xl font-bold tracking-tighter text-secondary mb-4">
              {t("gallery.cta.title")}
            </h2>
            <p className="text-secondary/80 mb-8">
              {t("gallery.cta.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90"
              >
                <Link href={`/${lang}/activites`}>{t("gallery.cta.activities")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-secondary text-secondary hover:bg-primary/80"
              >
                <Link
                  href={`/${lang}/contact`}
                  className="text-white hover:text-[#232323]"
                >
                  {t("gallery.cta.contact")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
