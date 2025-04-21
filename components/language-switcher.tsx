'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  
  // Fonction pour extraire la langue actuelle et le reste du chemin
  const getLocalizedPath = (newLang: string) => {
    // Extraire la partie après la langue (/fr/about -> /about)
    const segments = pathname.split('/');
    const currentLang = segments[1];
    const restPath = segments.slice(2).join('/');
    
    // Construire le nouveau chemin
    return `/${newLang}/${restPath}`;
  };

  // Déterminer la langue actuelle
  const currentLang = pathname.split('/')[1];
  const isFrench = currentLang === 'fr';
  const isDutch = currentLang === 'nl';

  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className={isFrench ? 'bg-primary/20' : ''}
      >
        <Link href={getLocalizedPath('fr')}>FR</Link>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        asChild
        className={isDutch ? 'bg-primary/20' : ''}
      >
        <Link href={getLocalizedPath('nl')}>NL</Link>
      </Button>
    </div>
  );
} 