import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramCard from "@/components/program-card";
import TestimonialSlider from "@/components/testimonial-slider";
import SponsorsCarousel from "@/components/sponsors-carousel";
import { activitiesService } from "@/lib/firebaseService";
import { getI18n } from '@/utils/server-i18n';

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  // Récupération des traductions pour la langue courante
  const { t } = await getI18n(lang);
  
  // Récupération des activités depuis Firebase
  const activities = await activitiesService.getAll();
  const activitiesWithIndividual = [
    {
      id: "individual",
      titleFr: t("individual.title") as string,
      subtitleFr: t("individual.description") as string,
      titleNl: t("individual.title") as string,
      subtitleNl: t("individual.description") as string,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/befacademy.firebasestorage.app/o/activities%2Fimage00011.webp?alt=media&token=10f77dac-e23d-4625-97ff-7c9d85b0c7c5",
      link: `/${lang}/reservation-individuelle`,
      isIndividual: true,
    },
    ...activities,
  ];

  // Utilisation des activités de Firebase si disponibles, sinon les activités par défaut
  const displayActivities =
    activitiesWithIndividual.length > 0
      ? activitiesWithIndividual
          .slice(0, 3)
          .reverse()
          .map((activity) => ({
            id: activity.id,
            titleFr: activity.titleFr,
            subtitleFr: activity.subtitleFr,
            subtitleNl: activity.subtitleNl,
            titleNl: activity.titleNl,
            imageUrl: activity.imageUrl,
            link: activity?.link ? activity.link : `/${lang}/activites/${activity.id}`,
          }))
      : [];
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Hero Section - Image Enhanced */}
      <section className="relative w-full h-[95vh] flex items-center overflow-hidden bg-secondary pt-20 px-20">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary via-secondary to-primary/20"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-foreground to-transparent z-10"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Content Column - Reduced width on desktop */}
            <div className="md:col-span-5 space-y-4 md:space-y-5 order-2 md:order-1">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                <MapPin className="mr-1 h-3 w-3" />
                <span>KSC Grimbergen</span>
              </div>

              <h1 className="text-3xl sm:text-3xl md:text-3xl font-bold tracking-tighter text-white leading-tight">
                   {t("home.hero.title") as string}
              </h1>

              <p className="text-base sm:text-lg text-gray-300">
                {t("home.hero.description") as string}
              </p>

              <div className="flex flex-nowrap sm:flex-col md:flex-row gap-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-secondary hover:bg-primary/90"
                >
                  <Link href={`/${lang}/activites`}>
                    {t("home.hero.button") as string}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  {t("home.hero.more") as string}
                </Button>
              </div>

              {/* Partenariat logos - mobile friendly */}
              <div className="flex items-center flex-nowrap gap-1 pt-2">
                <p className="text-white text-md sm:text-sm whitespace-nowrap">
                  {t("home.partnership") as string}
                </p>
                <div className="flex items-center flex-nowrap gap-4 py-2 px-4 rounded-full">
                  <Image
                    src="/images/belgium-flag-logo.png"
                    alt="BEFA Logo"
                    width={65}
                    height={65}
                    className="object-contain"
                  />
                  <span className="text-lg font-bold me-[-5px] text-white">
                    X
                  </span>
                  <Link href="https://www.kscg.be/" target="_blank">
                    <Image
                      src="/images/ksc-grimbergen-logo.png"
                      alt="KSC Grimbergen Logo"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Column - Expanded width on desktop */}
            <div className="md:col-span-7 relative order-1 md:order-2 md:flex justify-center md:justify-end hidden">
              {/* Larger image container with spotlight effect */}
              <div className="relative w-full max-w-[80%] md:max-w-[80%] aspect-[1/1]">
                {/* Spotlight effect */}
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl opacity-40 transform scale-75 -translate-x-1/4 -translate-y-1/4 mix-blend-screen"></div>

                {/* Main image with enhanced styling */}
                <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl shadow-2xl">
                  {/* Overlay gradient for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent  z-10"></div>

                  {/* The image itself */}
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/befacademy.firebasestorage.app/o/activities%2Fimage00017.webp?alt=media&token=f7c16d92-e9d7-470e-baa5-a60b4b354881"
                    alt="Jeune joueur BEFA"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Approche */}
      <section id="approche" className="py-24 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              {t("home.approach.title") as string}
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("home.approach.subtitle") as string}
            </h2>
            <p className="text-gray-500 max-w-[800px]">
              {t("home.approach.description") as string}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-secondary p-6 transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </div>
                <h3 className="text-white mb-2 text-xl font-bold text-white">
                  {t("home.approach.technique.tite") as string}
                </h3>
                <p className="text-gray-400">
                  {t("home.approach.technique.description") as string}
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-secondary p-6 transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.5 9.4 7.55 4.24" />
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="M3.29 7 12 12l8.71-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <h3 className="text-white mb-2 text-xl font-bold text-white">
                  {t("home.approach.tactics.title") as string}
                </h3>
                <p className="text-gray-400">
                  {t("home.approach.tactics.description") as string}
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-secondary p-6 transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 19h8a4 4 0 0 0 4-4 7 7 0 0 0-7-7h-1a7 7 0 0 0-7 7 4 4 0 0 0 4 4Z" />
                    <path d="M12 19v3" />
                    <path d="M12 3v4" />
                    <path d="m4.2 5.5 1.5 1.5" />
                    <path d="m18.3 5.5-1.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-white mb-2 text-xl font-bold text-white">
                  {t("home.approach.mental.title") as string}
                </h3>
                <p className="text-gray-400">
                  {t("home.approach.mental.description") as string}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* activités */}
      <section id="activités" className="py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              {t("home.activities.title") as string}
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">
              {t("home.activities.subtitle") as string}
            </h2>
            <p className="text-gray-400 max-w-[800px]">
              {t("home.activities.description") as string}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayActivities.map((activity) => (
              <ProgramCard
                key={activity.id}
                activity={activity as any}
                link={activity.link}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              <Link href={`/${lang}/activites`}>
                {t("home.activities.button") as string}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-24 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              {t("home.testimonials.title") as string}
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("home.testimonials.subtitle") as string}
            </h2>
            <p className="text-gray-500 max-w-[800px]">
              {t("home.testimonials.description") as string}
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-16 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              {t("home.partners.title") as string}
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("home.partners.subtitle") as string}
            </h2>
            <p className="text-gray-400 max-w-[800px]">
              {t("home.partners.description") as string}
            </p>
          </div>

          <SponsorsCarousel />

          <div className="mt-10 text-center">
            <p className="text-gray-400 mb-6">
              {t("home.partners.cta") as string}
            </p>
            <Button
              asChild
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              <Link href={`/${lang}/sponsoring`}>
                {t("home.partners.button") as string} <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-secondary">
                {t("home.cta.title") as string}
              </h2>
              <p className="text-secondary/80 max-w-[600px]">
                {t("home.cta.description") as string}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-primary hover:bg-secondary/90"
            >
              <Link href={`/${lang}/activites`}>
                {t("home.cta.button") as string} <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
