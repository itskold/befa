import { createInstance } from 'i18next';
import { defaultLocale } from '../middleware';

// Importation des fichiers de traduction
import frTranslation from '../locales/fr/common.json';
import nlTranslation from '../locales/nl/common.json';

export async function getI18n(locale = defaultLocale) {
  const i18nInstance = createInstance();
  
  await i18nInstance.init({
    lng: locale,
    fallbackLng: defaultLocale,
    resources: {
      fr: {
        common: frTranslation
      },
      nl: {
        common: nlTranslation
      }
    },
    defaultNS: 'common'
  });

  return {
    t: (key, options) => i18nInstance.t(key, options),
    i18n: i18nInstance
  };
}

export async function getDictionary(locale) {
  const { i18n } = await getI18n(locale);
  
  // Retourner toutes les traductions pour cette langue
  return i18n.getResourceBundle(locale, 'common');
} 