"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/gallery-grid";
import { GalleryCategory } from "@/lib/types";

// Type pour les images formatées pour l'affichage dans la grille
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  description?: string;
}

interface ClientGalleryProps {
  images: GalleryImage[];
  categories: GalleryCategory[];
  lang: string;
  translations: {
    all: string;
    loading: string;
  };
}

export default function ClientGallery({ images, categories, lang, translations }: ClientGalleryProps) {
  const [loading, setLoading] = useState(false);
  const [galleryImages] = useState<GalleryImage[]>(images);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;

  // Filtrer les images par catégorie
  const filterByCategory = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de filtre
    
    if (categoryName === null) {
      // Afficher toutes les images
      setFilteredImages(galleryImages);
    } else {
      // Filtrer par catégorie
      const filtered = galleryImages.filter(img => img.category === categoryName);
      setFilteredImages(filtered);
    }
  };

  // Calculer les images à afficher sur la page actuelle
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <>
      {/* Filtres */}
      <section className="py-8 bg-foreground border-b border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              className={
                selectedCategory === null 
                  ? "bg-primary text-secondary" 
                  : "text-gray-300 hover:text-primary hover:bg-secondary/20"
              }
              onClick={() => filterByCategory(null)}
            >
              {translations.all}
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === (lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr) ? "default" : "ghost"}
                className={
                  selectedCategory === (lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr)
                    ? "bg-primary text-secondary" 
                    : "text-gray-300 hover:text-primary hover:bg-secondary/20"
                }
                onClick={() => filterByCategory(lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr)}
              >
                {lang === 'fr' ? category.namefr : lang === 'nl' ? category.namenl : category.namefr}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-16 bg-foreground">
        <div className="container px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12">{translations.loading}</div>
          ) : (
            <>
              <GalleryGrid images={currentImages} />
              
              {/* Pagination */}
              {filteredImages.length > imagesPerPage && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="border-gray-700 text-gray-300 hover:text-primary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Logique pour afficher les 5 pages les plus pertinentes
                      let pageNum;
                      if (totalPages <= 5) {
                        // Moins de 5 pages, on affiche toutes
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // Si on est au début, afficher les pages 1-5
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Si on est à la fin, afficher les 5 dernières
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Sinon, afficher 2 avant et 2 après la page courante
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          className={
                            currentPage === pageNum
                              ? "bg-primary text-secondary"
                              : "border-gray-700 text-gray-300 hover:text-primary"
                          }
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="border-gray-700 text-gray-300 hover:text-primary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
} 