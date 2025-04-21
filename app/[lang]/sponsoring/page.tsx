import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SponsorshipForm, { SponsorshipFormTranslations } from "@/components/sponsorship-form";
import SponsorsCarousel from "@/components/sponsors-carousel";
import { getI18n } from '@/utils/server-i18n';

export default async function SponsoringPage({ params: { lang } }: { params: { lang: string } }) {
  // Récupération des traductions pour la langue courante
  const { t } = await getI18n(lang);

  // Créer un objet avec toutes les traductions nécessaires pour le formulaire
  const formTranslations: SponsorshipFormTranslations = {
    title: t("sponsoring.form.form.title") as string,
    success: {
      title: t("sponsoring.form.form.success.title") as string,
      description: t("sponsoring.form.form.success.description") as string,
      button: t("sponsoring.form.form.success.button") as string,
    },
    error: {
      title: t("sponsoring.form.error.title") as string,
      description: t("sponsoring.form.error.description") as string,
      retry: t("sponsoring.form.error.retry") as string,
    },
    formSchema: {
      companyName: t("sponsoring.form.formSchema.companyName") as string,
      contactName: t("sponsoring.form.formSchema.contactName") as string,
      email: t("sponsoring.form.formSchema.email") as string,
      phone: t("sponsoring.form.formSchema.phone") as string,
      position: t("sponsoring.form.formSchema.position") as string,
      package: t("sponsoring.form.formSchema.package") as string,
      message10: t("sponsoring.form.formSchema.message10") as string,
      message500: t("sponsoring.form.formSchema.message500") as string,
      consent: t("sponsoring.form.formSchema.consent") as string,
    },
    formuleLabels: {
      supporter: t("sponsoring.form.formuleLabels.supporter") as string,
      champion: t("sponsoring.form.formuleLabels.champion") as string,
      elite: t("sponsoring.form.formuleLabels.elite") as string,
      legend: t("sponsoring.form.formuleLabels.legend") as string,
      custom: t("sponsoring.form.formuleLabels.custom") as string,
    },
    companyName: t("sponsoring.form.form.companyName") as string,
    companyNamePlaceholder: t("sponsoring.form.form.companyNamePlaceholder") as string,
    contactName: t("sponsoring.form.form.contactName") as string,
    contactNamePlaceholder: t("sponsoring.form.form.contactNamePlaceholder") as string,
    position: t("sponsoring.form.form.position") as string,
    positionPlaceholder: t("sponsoring.form.form.positionPlaceholder") as string,
    email: t("sponsoring.form.form.email") as string,
    emailPlaceholder: t("sponsoring.form.form.emailPlaceholder") as string,
    phone: t("sponsoring.form.form.phone") as string,
    phonePlaceholder: t("sponsoring.form.form.phonePlaceholder") as string,
    package: t("sponsoring.form.form.package") as string,
    packagePlaceholder: t("sponsoring.form.form.packagePlaceholder") as string,
    message: t("sponsoring.form.form.message") as string,
    messagePlaceholder: t("sponsoring.form.form.messagePlaceholder") as string,
    budget: t("sponsoring.form.form.budget") as string,
    budgetPlaceholder: t("sponsoring.form.form.budgetPlaceholder") as string,
    consent: t("sponsoring.form.form.consent") as string,
    loading: t("sponsoring.form.form.loading") as string,
    submit: t("sponsoring.form.form.submit") as string,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              {t("sponsoring.title1") as string} <span className="text-primary">{t("sponsoring.title2") as string}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t("sponsoring.subtitle") as string}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              <a href="#formules">
                {t("sponsoring.button") as string} <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Notre histoire */}
      <section className="py-20 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="BEFA Academy Histoire"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <Badge className="bg-primary text-secondary mb-2">
                    {t("sponsoring.story.title") as string}
                  </Badge>
                  <h2 className="text-white text-2xl font-bold text-white">
                    {t("sponsoring.story.subtitle") as string}
                  </h2>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                {t("sponsoring.story.title") as string} <span className="text-primary">{t("sponsoring.story.title2") as string}</span>
              </h2>
              <p className="text-gray-400">
                {t("sponsoring.story.description") as string}
              </p>
              <p className="text-gray-400">
                {t("sponsoring.story.description2") as string}
              </p>

              <div className="space-y-4 pt-4">
                <h3 className="text-white text-xl font-bold">
                  {t("sponsoring.story.values.title") as string}
                </h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      {t("sponsoring.story.values.subtitle") as string}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {t("sponsoring.story.values.description") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      {t("sponsoring.story.values.subtitle2") as string}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {t("sponsoring.story.values.description2") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">
                      {t("sponsoring.story.values.subtitle3") as string}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {t("sponsoring.story.values.description3") as string}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activités et Infrastructures */}
      {/* <section className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                Nos <span className="text-primary">Activités</span>
              </h2>
              <p className="text-gray-400">
                Chez BEFA, nous proposons des entraînements ciblés en effectif
                réduit, menés par nos spécialistes pour favoriser une
                progression rapide et approfondir la maîtrise technique.
              </p>
              <p className="text-gray-400">
                Parallèlement, nous co-organisons des activités intensifs avec
                le KSC Grimbergen, dont la direction sportive est assurée par
                BEFA, afin d'offrir un contenu varié (ateliers méthodologiques,
                séances axées sur le jeu) et de garantir un développement
                complet des joueurs tout en renforçant la cohésion de groupe.
              </p>
              <div className="relative rounded-xl overflow-hidden mt-6">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Activités BEFA Academy"
                  width={500}
                  height={300}
                  className="object-cover w-full h-[300px]"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                Nos <span className="text-primary">Infrastructures</span>
              </h2>
              <p className="text-gray-400">
                Grâce à notre partenariat avec le KSC Grimbergen, nous disposons
                de terrains synthétiques dernier cri, installés en 2024, dont le
                revêtement de haute qualité garantit des conditions de jeu
                optimales et minimise les risques de blessure.
              </p>
              <p className="text-gray-400">
                Des vestiaires spacieux et un matériel régulièrement renouvelé
                (ballons, chasubles, buts) assurent un niveau d'exigence
                constant. Un parking généreux facilite l'accueil, tandis qu'un
                éclairage performant prolonge les séances.
              </p>
              <div className="relative rounded-xl overflow-hidden mt-6">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Infrastructures BEFA Academy"
                  width={500}
                  height={300}
                  className="object-cover w-full h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Formules de sponsoring */}
      <section id="formules" className="py-20 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("sponsoring.formules.title1") as string} <span className="text-primary">{t("sponsoring.formules.title2") as string}</span>
            </h2>
            <p className="text-gray-400 max-w-[800px] mx-auto">
              {t("sponsoring.formules.description") as string}
            </p>
          </div>

          {/* Formules Supporter, Champion, Élite */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Formule Supporter */}
            <Card className="bg-secondary border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/10"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl text-white">{t("sponsoring.formules.supporter.title") as string}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("sponsoring.formules.supporter.description") as string}
                </CardDescription>
                <div className="mt-4 text-3xl font-bold text-primary">
                  650 €<span className="text-sm text-gray-400">/{t("sponsoring.formules.supporter.year") as string}</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.supporter.items.item1") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.supporter.items.item2") as string}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button
                  asChild
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                >
                  <a href="#contact">{t("sponsoring.formules.supporter.button") as string}</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Formule Champion */}
            <Card className="bg-secondary border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/10"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl text-white">{t("sponsoring.formules.champion.title") as string}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("sponsoring.formules.champion.description") as string}
                </CardDescription>
                <div className="mt-4 text-3xl font-bold text-primary">
                  1.650 €<span className="text-sm text-gray-400">/{t("sponsoring.formules.champion.year") as string}</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.champion.items.item1") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.champion.items.item2") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.champion.items.item3") as string}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button
                  asChild
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                >
                  <a href="#contact">{t("sponsoring.formules.champion.button") as string}</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Formule Élite */}
            <Card className="bg-secondary border-2 border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/20"></div>
              <div className="absolute top-5 right-5">
                <Badge className="bg-primary text-secondary">{t("sponsoring.formules.elite.badge") as string}</Badge>
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl text-white">{t("sponsoring.formules.elite.title") as string}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("sponsoring.formules.elite.description") as string}
                </CardDescription>
                <div className="mt-4 text-3xl font-bold text-primary">
                  2.750 €<span className="text-sm text-gray-400">/{t("sponsoring.formules.elite.year") as string}</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.elite.items.item1") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.elite.items.item2") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.elite.items.item3") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {t("sponsoring.formules.elite.items.item4") as string}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button
                  asChild
                  className="w-full bg-primary text-secondary hover:bg-primary/90"
                >
                  <a href="#contact">{t("sponsoring.formules.elite.button") as string}</a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Formule Légende (col-span-3) */}
          <div className="mb-8">
            <Card className="bg-secondary border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/10"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardHeader className="relative z-10 md:col-span-1">
                  <CardTitle className="text-2xl text-white">{t("sponsoring.formules.legend.title") as string}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {t("sponsoring.formules.legend.description") as string}
                  </CardDescription>
                  <div className="mt-4 text-4xl font-bold text-primary">
                    3.450 €<span className="text-sm text-gray-400">/{t("sponsoring.formules.legend.year") as string}</span>
                  </div>
                  <div className="mt-6">
                    <Button
                      asChild
                      className="w-full bg-primary text-secondary hover:bg-primary/90"
                    >
                      <a href="#contact">{t("sponsoring.formules.legend.button") as string}</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 md:col-span-2 flex items-center pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    <div className="space-y-3 space-x-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {t("sponsoring.formules.legend.items.item1") as string}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {t("sponsoring.formules.legend.items.item2") as string}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {t("sponsoring.formules.legend.items.item3") as string}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {t("sponsoring.formules.legend.items.item4") as string}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {t("sponsoring.formules.legend.items.items5") as string}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {t("sponsoring.formules.legend.items.item6") as string}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {t("sponsoring.formules.legend.items.item7") as string}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {t("sponsoring.formules.legend.items.item8") as string}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {t("sponsoring.formules.legend.items.item9") as string}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {t("sponsoring.formules.legend.items.item10") as string}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {t("sponsoring.formules.legend.items.item11") as string}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {t("sponsoring.formules.legend.items.item12") as string}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 italic text-sm">
              {t("sponsoring.formules.info") as string}
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              {t("sponsoring.formules.contact") as string}
            </p>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <a href="#contact">{t("sponsoring.formules.button") as string}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Nos partenaires */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("sponsoring.partners.title1") as string} <span className="text-primary">{t("sponsoring.partners.title2") as string}</span>
            </h2>
            <p className="text-gray-400 max-w-[800px] mx-auto">
              {t("sponsoring.partners.description") as string}
            </p>
          </div>

          <SponsorsCarousel />
        </div>
      </section>

      {/* Témoignages sponsors */}
      <section className="py-20 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("sponsoring.testimonials.title1") as string}{" "} <span className="text-primary">{t("sponsoring.testimonials.title2") as string}</span>
            </h2>
            <p className="text-gray-400 max-w-[800px] mx-auto">
              {t("sponsoring.testimonials..description") as string}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Témoignage 1 */}
            <div className="bg-secondary rounded-xl p-6 relative">
              <div className="absolute top-6 right-6 text-primary opacity-20">
                <svg
                  className="h-12 w-12"
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
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6 relative z-10">
                {t("sponsoring.testimonials.testimonials.moupress.description") as string}
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Image
                    src="/images/sponsors/moupress.png"
                    alt="Logo sponsor Moupress"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">Mourad Khattabi</h4>
                  <p className="text-sm text-gray-400">
                  {t("sponsoring.testimonials.testimonials.moupress.status") as string} , Moupress
                  </p>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="bg-secondary rounded-xl p-6 relative">
              <div className="absolute top-6 right-6 text-primary opacity-20">
                <svg
                  className="h-12 w-12"
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
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6 relative z-10">
                {t("sponsoring.testimonials.testimonials.karbill.description") as string}
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Image
                    src="/images/sponsors/karbill.png"
                    alt="Logo sponsor Karbill"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">Noyan Aykut</h4>
                  <p className="text-sm text-gray-400">
                    {t("sponsoring.testimonials.testimonials.karbill.status") as string}, Karbill
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section id="contact" className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                {t("sponsoring.form.title1") as string} <span className="text-primary">{t("sponsoring.form.title2") as string}</span> 
              </h2>
              <p className="text-gray-400">
                {t("sponsoring.form.description") as string}
              </p>

              <div className="bg-secondary rounded-xl p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-primary"
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-white font-medium">
                      {t("sponsoring.form.direct") as string}
                    </h3>
                    <p className="text-gray-400">
                      +32 475 94 18 55 / +32 473 99 91 70
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-primary"
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
                      <rect height="16" rx="2" width="20" x="2" y="4" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-white font-medium">Email</h3>
                    <p className="text-gray-400">info@befa-academy.be</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-primary"
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
                      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                      <path d="M12 11h.01" />
                      <path d="M12 8v2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-white font-medium">
                      {t("sponsoring.form.website") as string}
                    </h3>
                    <p className="text-gray-400">www.befa-academy.be</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 text-white">
                  {t("sponsoring.form.download") as string}
                </h3>
                <p className="text-gray-400 mb-4">
                  {t("sponsoring.form.downloadText") as string}
                </p>
                <Button
                  asChild
                  className="w-full bg-primary text-secondary hover:bg-primary/90"
                >
                  <a href="/brochure">{t("sponsoring.form.downloadButton") as string}</a>
                </Button>
              </div>
            </div>

            <div>
              <SponsorshipForm translations={formTranslations} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
