import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { activitiesService } from "@/lib/firebaseService";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getDictionary } from "@/utils/server-i18n";
import { I18nProvider } from "@/utils/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEFA Academy",
  description: "École de football spécialisée proposant des programmes d'entraînement innovants",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Récupération des traductions pour la langue courante
  const dictionary = await getDictionary(lang);

  const activities = await activitiesService.getAll();
  const activitiesWithIndividual = [
    {
      id: "individual",
      titleFr: dictionary.individual.title,
      subtitleFr: dictionary.individual.description,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/befacademy.firebasestorage.app/o/activities%2Fimage00011.webp?alt=media&token=10f77dac-e23d-4625-97ff-7c9d85b0c7c5",
      link: "/reservation-individuelle",
      isIndividual: true,
    },
    ...activities,
  ];

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-foreground antialiased")}>
        <I18nProvider dictionary={dictionary} lang={lang}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Header dictionary={dictionary} lang={lang} />
              <main className="flex-1">{children}</main>
              <Footer activities={activitiesWithIndividual} dictionary={dictionary} />
              <Toaster />
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
