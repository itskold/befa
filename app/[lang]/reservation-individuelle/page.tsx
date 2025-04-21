import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  Target,
  Award,
} from "lucide-react";
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
import ReservationForm, { ReservationFormTranslations } from "@/components/reservation-form";
import { getI18n } from '@/utils/server-i18n';

export default async function ReservationIndividuellePage({ params: { lang } }: { params: { lang: string } }) {
  // Récupération des traductions pour la langue courante
  const { t } = await getI18n(lang);
  
  // Créer un objet avec toutes les traductions nécessaires pour le formulaire
  const formTranslations: ReservationFormTranslations = {
    title: t("reservationIndividual.form.form.title") as string,
    subtitle: t("reservationIndividual.form.form.subtitle") as string,
    subtitle2: t("reservationIndividual.form.form.subtitle2") as string,
    sessionType: t("reservationIndividual.form.form.sessionType") as string,
    duration: t("reservationIndividual.form.form.duration") as string,
    date: t("reservationIndividual.form.form.date") as string,
    datePlaceholder: t("reservationIndividual.form.form.datePlaceholder") as string,
    time: t("reservationIndividual.form.form.time") as string,
    timePlaceholder: t("reservationIndividual.form.form.timePlaceholder") as string,
    firstName: t("reservationIndividual.form.form.firstName") as string,
    firstNamePlaceholder: t("reservationIndividual.form.form.firstNamePlaceholder") as string,
    lastName: t("reservationIndividual.form.form.lastName") as string,
    lastNamePlaceholder: t("reservationIndividual.form.form.lastNamePlaceholder") as string,
    email: t("reservationIndividual.form.form.email") as string,
    emailPlaceholder: t("reservationIndividual.form.form.emailPlaceholder") as string,
    phone: t("reservationIndividual.form.form.phone") as string,
    phonePlaceholder: t("reservationIndividual.form.form.phonePlaceholder") as string,
    age: t("reservationIndividual.form.form.age") as string,
    agePlaceholder: t("reservationIndividual.form.form.agePlaceholder") as string,
    level: t("reservationIndividual.form.form.level") as string,
    levelPlaceholder: t("reservationIndividual.form.form.levelPlaceholder") as string,
    levels: {
      debutant: t("reservationIndividual.form.form.levels.debutant") as string,
      intermediaire: t("reservationIndividual.form.form.levels.intermediaire") as string,
      avance: t("reservationIndividual.form.form.levels.avance") as string,
      professionnel: t("reservationIndividual.form.form.levels.professionnel") as string,
    },
    objectives: t("reservationIndividual.form.form.objectives") as string,
    objectivesPlaceholder: t("reservationIndividual.form.form.objectivesPlaceholder") as string,
    total: t("reservationIndividual.form.form.total") as string,
    payment: t("reservationIndividual.form.form.payment") as string,
    button: t("reservationIndividual.form.form.button") as string,
    loading: t("reservationIndividual.form.form.loading") as string,
    sessionTypes: {
      technique: t("reservationIndividual.form.sessionTypes.technique") as string,
      tactique: t("reservationIndividual.form.sessionTypes.tactique") as string,
      physique: t("reservationIndividual.form.sessionTypes.physique") as string,
      gardien: t("reservationIndividual.form.sessionTypes.gardien") as string,
    },
    durations: {
      "60": t("reservationIndividual.form.durations.60") as string,
      "90": t("reservationIndividual.form.durations.90") as string,
      "120": t("reservationIndividual.form.durations.120") as string,
    },
    success: {
      title: t("reservationIndividual.form.form.success.title") as string,
      subtitle: t("reservationIndividual.form.form.success.subtitle") as string,
      subtitle2: t("reservationIndividual.form.form.success.subtitle2") as string,
      description: t("reservationIndividual.form.form.success.description") as string,
      button: t("reservationIndividual.form.form.success.button") as string,
    },
    cancel: t("reservationIndividual.form.form.cancel") as string,
    validationErrors: {
      missingInfo: "Information manquante",
      missingFields: "Veuillez remplir tous les champs obligatoires",
    },
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              {t("reservationIndividual.title1") as string} <span className="text-primary">{t("reservationIndividual.title2") as string}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t("reservationIndividual.description") as string}
            </p>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              <a href="#formules">
                {t("reservationIndividual.button") as string} <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Pourquoi choisir une session individuelle */}
      <section className="py-20 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/befacademy.firebasestorage.app/o/activities%2Fimage00011.webp?alt=media&token=10f77dac-e23d-4625-97ff-7c9d85b0c7c5"
                  alt="Entraînement individuel BEFA Academy"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <Badge className="bg-primary text-secondary mb-2">
                    {t("reservationIndividual.badge") as string}
                  </Badge>
                  <h2 className="text-white text-2xl font-bold text-white">
                    {t("reservationIndividual.title3") as string}
                  </h2>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                {t("reservationIndividual.title4") as string} <span className="text-primary">{t("reservationIndividual.title5") as string}</span>
              </h2>
              <p className="text-gray-400">
                {t("reservationIndividual.description2") as string}
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-white">
                      {t("reservationIndividual.attention") as string}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {t("reservationIndividual.attentionDescription") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-white">
                      {t("reservationIndividual.progression") as string}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {t("reservationIndividual.progressionDescription") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-white">
                      {t("reservationIndividual.objectifs") as string}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {t("reservationIndividual.objectifsDescription") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-white">
                      {t("reservationIndividual.flexibility") as string}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {t("reservationIndividual.flexibilityDescription") as string}
                      mieux
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formules de sessions */}
      <section id="formules" className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("reservationIndividual.formules.title") as string} <span className="text-primary">{t("reservationIndividual.formules.title2") as string}</span>
            </h2>
            <p className="text-gray-400 max-w-[800px] mx-auto">
              {t("reservationIndividual.formules.description") as string}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formule Technique */}
            <Card className="bg-secondary border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/10"></div>
              <CardHeader className="relative z-10">
                <div className="mb-2">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-white">
                  {t("reservationIndividual.formules.technique.title") as string}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t("reservationIndividual.formules.technique.description") as string}
                </CardDescription>
                <div className="mt-4 text-3xl font-bold text-primary">
                  45 €<span className="text-sm text-gray-400">/{t("reservationIndividual.formules.technique.session") as string}</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.technique.items.item1") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.technique.items.item2") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.technique.items.item3") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.technique.items.item4") as string}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button
                  asChild
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                >
                  <a href="#reservation">
                    {t("reservationIndividual.formules.technique.button") as string}
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Formule Tactique */}
            <Card className="bg-secondary border-2 border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/20"></div>
              <div className="absolute top-5 right-5">
                <Badge className="bg-primary text-secondary">
                  {t("reservationIndividual.formules.tactique.badge") as string}
                </Badge>
              </div>
              <CardHeader className="relative z-10">
                <div className="mb-2">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-white">
                  {t("reservationIndividual.formules.tactique.title") as string}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t("reservationIndividual.formules.tactique.description") as string}
                </CardDescription>
                <div className="mt-4 text-3xl font-bold text-primary">
                  50 €<span className="text-sm text-gray-400">/{t("reservationIndividual.formules.tactique.session") as string}</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.tactique.items.item1") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.tactique.items.item2") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.tactique.items.item3") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.tactique.items.item4") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.tactique.items.item5") as string}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button
                  asChild
                  className="w-full bg-primary text-secondary hover:bg-primary/90"
                >
                  <a href="#reservation">
                    {t("reservationIndividual.formules.tactique.button") as string}
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* Formule Physique */}
            <Card className="bg-secondary border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-primary/10"></div>
              <CardHeader className="relative z-10">
                <div className="mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-white">
                  {t("reservationIndividual.formules.physique.title") as string}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t("reservationIndividual.formules.physique.description") as string}
                </CardDescription>
                <div className="mt-4 text-3xl font-bold text-primary">
                  55 €<span className="text-sm text-gray-400">/{t("reservationIndividual.formules.physique.session") as string}</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.physique.items.item1") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.physique.items.item2") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.physique.items.item3") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.physique.items.item4") as string}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-300">
                      {t("reservationIndividual.formules.physique.items.item5") as string}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button
                  asChild
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30"
                >
                  <a href="#reservation">
                    {t("reservationIndividual.formules.physique.button") as string}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              {t("reservationIndividual.formules.custom.description") as string}
            </p>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <a href="#reservation">
                {t("reservationIndividual.formules.custom.button") as string}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Options de durée */}
      <section className="py-16 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl font-bold tracking-tighter mb-4">
              {t("reservationIndividual.formules.duration.title") as string} <span className="text-primary">{t("reservationIndividual.formules.duration.title2") as string}</span>
            </h2>
            <p className="text-gray-400 max-w-[800px] mx-auto">
              {t("reservationIndividual.formules.duration.description") as string}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-secondary border-0">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {t("reservationIndividual.formules.duration.60") as string}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">
                  {t("reservationIndividual.formules.duration.standard") as string}
                </p>
                <p className="text-gray-400">
                  {t("reservationIndividual.formules.duration.sessionStandard") as string}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-0">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {t("reservationIndividual.formules.duration.90") as string}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">
                  {t("reservationIndividual.formules.duration.plus40") as string}
                </p>
                <p className="text-gray-400">
                  {t("reservationIndividual.formules.duration.sessionApprofondie") as string}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary border-0">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {t("reservationIndividual.formules.duration.120") as string}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">
                  {t("reservationIndividual.formules.duration.plus80") as string}
                </p>
                <p className="text-gray-400">
                  {t("reservationIndividual.formules.duration.sessionIntensive") as string}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formulaire de réservation */}
      <section id="reservation" className="py-20 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                {t("reservationIndividual.form.title") as string} <span className="text-primary">{t("reservationIndividual.form.title2") as string}</span>
              </h2>
              <p className="text-gray-400">
                {t("reservationIndividual.form.description") as string}
              </p>

              <div className="bg-secondary rounded-xl p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white text-white font-medium">
                      {t("reservationIndividual.form.availability") as string}
                    </h3>
                    <p className="text-gray-400">
                      {t("reservationIndividual.form.availabilityDescription") as string}
                    </p>
                    <p className="text-gray-400">
                      {t("reservationIndividual.form.availabilityDescription2") as string}
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-white font-medium">
                      {t("reservationIndividual.form.direct") as string}
                    </h3>
                    <p className="text-gray-400">+32 473 99 91 70</p>
                    <p className="text-sm text-gray-500">
                      {t("reservationIndividual.form.directDescription") as string}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 text-white">
                  {t("reservationIndividual.form.important") as string}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>
                      {t("reservationIndividual.form.importantDescription") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>
                      {t("reservationIndividual.form.importantDescription2") as string}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>
                      {t("reservationIndividual.form.importantDescription3") as string}
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-primary text-secondary hover:bg-primary/90">
                  {t("reservationIndividual.form.download") as string}
                </Button>
              </div>
            </div>

            <div>
              <ReservationForm translations={formTranslations} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
