import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') || 'fr';
  
  try {
    // Chemin vers le fichier de traduction
    const filePath = path.join(process.cwd(), 'locales', lang, 'common.json');
    
    // Lecture du fichier
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const translations = JSON.parse(fileContent);
    
    return NextResponse.json(translations);
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    
    // En cas d'erreur, essayer de charger les traductions en français par défaut
    if (lang !== 'fr') {
      try {
        const defaultFilePath = path.join(process.cwd(), 'locales', 'fr', 'common.json');
        const defaultFileContent = await fs.readFile(defaultFilePath, 'utf-8');
        const defaultTranslations = JSON.parse(defaultFileContent);
        
        return NextResponse.json(defaultTranslations);
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError);
      }
    }
    
    return NextResponse.json({}, { status: 500 });
  }
} 