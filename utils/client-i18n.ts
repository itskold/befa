'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type pour les traductions
type Translations = Record<string, any>;

// Cache pour les traductions
const translationsCache: Record<string, Translations> = {};

export function useTranslation() {
  const { lang } = useParams() as { lang: string };
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        // Si les traductions sont déjà en cache, les utiliser
        if (translationsCache[lang]) {
          setTranslations(translationsCache[lang]);
          setIsLoading(false);
          return;
        }

        // Sinon, charger les traductions
        const response = await fetch(`/api/translations?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Failed to load translations');
        }

        const data = await response.json();
        translationsCache[lang] = data;
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [lang]);

  // Fonction de traduction
  const t = (key: string) => {
    if (isLoading) return '';
    
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If the key doesn't exist, return the key itself
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, lang, isLoading };
} 