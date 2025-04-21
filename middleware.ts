import { NextRequest, NextResponse } from 'next/server'

const locales = ['fr', 'nl']
export const defaultLocale = 'fr'

// Fonction pour obtenir la locale depuis les cookies, les headers Accept-Language ou l'URL
function getLocale(request: NextRequest) {
  // Vérifier d'abord dans les cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // Essayer de détecter depuis l'en-tête Accept-Language
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const parsedLocales = acceptLanguage.split(',').map(l => l.split(';')[0].trim())
    const matchedLocale = parsedLocales.find(l => locales.includes(l))
    if (matchedLocale) return matchedLocale
  }

  // Par défaut
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Vérifier si le pathname a déjà une locale valide
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Rediriger si aucune locale n'est trouvée dans l'URL
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Matcher tous les chemins sauf ceux qui commencent par:
    // - api (API routes)
    // - _next/static (fichiers statiques)
    // - _next/image (optimisation d'images)
    // - favicon.ico (favicon)
    // - images/ (dossier d'images)
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
} 