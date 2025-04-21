'use client';

import React from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useParams } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';

// Initialisation minimaliste pour le côté client
i18next.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
  resources: {},  // On charge dynamiquement les ressources après
});

// Type pour le contexte
type I18nContextType = {
  t: (key: string, options?: any) => string;
  changeLanguage: (lang: string) => void;
  currentLang: string;
};

// Contexte pour fournir la fonction de traduction aux composants
const I18nContext = createContext<I18nContextType | null>(null);

// Provider qui va initialiser et fournir les traductions
export function I18nProvider({ 
  children, 
  dictionary,
  lang 
}: { 
  children: React.ReactNode;
  dictionary: Record<string, any>;
  lang: string;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Charger les traductions au montage du composant
    i18next.addResourceBundle(lang, 'common', dictionary, true, true);
    i18next.changeLanguage(lang);
    setIsInitialized(true);
  }, [dictionary, lang]);

  // Traduction simple (peut être étendue pour plus de fonctionnalités)
  const t = (key: string, options?: any): string => {
    return i18next.t(key, options) as string;
  };

  const changeLanguage = (newLang: string) => {
    i18next.changeLanguage(newLang);
  };

  if (!isInitialized) return null;

  return (
    <I18nContext.Provider value={{ t, changeLanguage, currentLang: lang }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook pour utiliser les traductions dans les composants
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// Fonction pour charger les traductions manuellement côté client
export async function loadClientTranslations(lang: string) {
  try {
    // Charger les traductions depuis le serveur
    const response = await fetch(`/api/translations?lang=${lang}`);
    if (!response.ok) throw new Error('Failed to fetch translations');
    
    const data = await response.json();
    
    // Ajouter les traductions à i18next
    i18next.addResourceBundle(lang, 'common', data, true, true);
    
    return true;
  } catch (error) {
    console.error('[i18n] Erreur lors du chargement des traductions:', error);
    return false;
  }
}

// Hook simple pour obtenir la fonction de traduction avec chargement automatique des ressources
export function useClientTranslation() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang || 'fr';
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Vérifier si les ressources pour cette langue sont déjà chargées
    const hasResources = i18next.hasResourceBundle(lang, 'common');
    
    if (!hasResources) {
      console.log(`[i18n] Ressources non chargées pour ${lang}, tentative de chargement...`);
      
      // Charger les traductions localement depuis les fichiers statiques
      fetch(`/locales/${lang}/common.json`)
        .then(response => {
          if (!response.ok) throw new Error(`Impossible de charger les traductions pour ${lang}`);
          return response.json();
        })
        .then(data => {
          console.log(`[i18n] Traductions chargées avec succès pour ${lang}`, Object.keys(data).length, 'clés');
          i18next.addResourceBundle(lang, 'common', data, true, true);
          i18next.changeLanguage(lang);
          setIsLoaded(true);
        })
        .catch(error => {
          console.error(`[i18n] Erreur lors du chargement des traductions:`, error);
          setIsLoaded(true); // Marquer comme chargé même en cas d'erreur pour éviter les boucles infinies
        });
    } else {
      i18next.changeLanguage(lang);
      setIsLoaded(true);
    }
  }, [lang]);
  
  // Fonction de traduction avec instrumentation
  const t = (key: string, options?: any): string => {
    const translated = i18next.t(key, options) as string;
    
    // En mode développement, ajouter un log pour les clés manquantes
    if (process.env.NODE_ENV === 'development' && translated === key) {
      console.log(`[i18n] Clé manquante: ${key}`);
    }
    
    return translated;
  };
  
  return { t, lang, isLoaded };
}

// Fonction simple pour les composants non-hooks
export const t = (key: string, options?: any): string => i18next.t(key, options) as string; 