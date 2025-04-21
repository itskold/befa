import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  Clock,
  Users,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { activitiesService, groupsService } from "@/lib/firebaseService";
import { daysOfWeek } from "@/lib/utils";
import { getI18n } from '@/utils/server-i18n';

// Récupération des activités depuis Firebase
export default async function ActivitesPage({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await getI18n(lang);

  const activities = await activitiesService.getAll();
  const groups = await groupsService.getAll();
    
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              {t("activities.hero.title1") as string} <span className="text-primary">{t("activities.hero.title2") as string}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t("activities.hero.description") as string}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Navigation des activités */}
      <section className="py-8 bg-foreground border-b border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {activities.map((activity) => (
              <Button
                key={activity.id}
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-primary hover:bg-secondary/20"
              >
                <Link href={`#${activity.id}`}>{lang === 'fr' ? activity.titleFr : lang === 'nl' ? activity.titleNl : activity.titleFr}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Entraînements Hebdomadaires */}
      {activities.map((activity) => (
        <section
          key={activity.id}
          id={activity.id}
          className="py-20 bg-foreground"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src={activity.imageUrl || "/images/hero-player-new.png"}
                    alt={lang === 'fr' ? activity.titleFr : lang === 'nl' ? activity.titleNl : activity.titleFr}
                    width={600}
                    height={400}
                    className="object-cover w-full h-[400px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <Badge className="bg-primary text-secondary mb-2">
                      {t("activities.regular") as string}
                    </Badge>
                    <h2 className="text-white text-2xl font-bold text-white">
                      {lang === 'fr' ? activity.titleFr : lang === 'nl' ? activity.titleNl : activity.titleFr}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-white text-3xl font-bold tracking-tighter">
                  <span className="text-primary">
                    {(lang === 'fr' ? activity.titleFr : lang === 'nl' ? activity.titleNl : activity.titleFr).split(" ")[0]}
                  </span>{" "}
                  {(lang === 'fr' ? activity.titleFr : lang === 'nl' ? activity.titleNl : activity.titleFr).split(" ").slice(1).join(" ")}
                </h2>
                <p className="text-gray-400">{lang === 'fr' ? activity.subtitleFr : lang === 'nl' ? activity.subtitleNl : activity.subtitleFr}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-secondary border-0">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <Calendar className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="text-white font-medium text-white">
                          {t("activities.period") as string}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {activity.dates[0]} -{" "}
                          {activity.dates[activity.dates.length - 1]}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-0">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="text-white font-medium text-white">
                          {t("activities.frequency") as string}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {activity.specificDays.length} {t("activities.sessionsPerWeek") as string}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-0">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="text-white font-medium text-white">
                          {t("activities.duration") as string}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {activity.duration} {t("activities.minutesPerSession") as string}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-0">
                    <CardContent className="p-4 flex items-start space-x-4">
                      <Users className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="text-white font-medium text-white">
                          {t("activities.age") as string}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {(() => {
                            const ages = groups
                              .filter(
                                (group) => group.activityId === activity.id
                              )
                              .map((group) => parseInt(group.name.substring(1)))
                              .filter(
                                (age, index, self) =>
                                  self.indexOf(age) === index
                              )
                              .sort((a, b) => a - b);

                            return ages.length > 0
                              ? `U${ages[0]} à U${ages[ages.length - 1]}`
                              : t("activities.allAges") as string;
                          })()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4">
                  <Button
                    className="bg-primary text-secondary hover:bg-primary/90"
                    asChild
                  >
                    <Link href={`/${lang}/activites/${activity.id}`}>
                      {t("activities.viewDetails") as string}{" "}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Cours Individuels */}
      <section id="individuels" className="py-20 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/befacademy.firebasestorage.app/o/activities%2Fimage00011.webp?alt=media&token=10f77dac-e23d-4625-97ff-7c9d85b0c7c5"
                  alt={t("activities.individual.title") as string}
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <Badge className="bg-primary text-secondary mb-2">
                    {t("activities.individual.badge") as string}
                  </Badge>
                  <h2 className="text-white text-2xl font-bold text-white">
                    {t("activities.individual.title") as string}
                  </h2>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-white text-3xl font-bold tracking-tighter">
                <span className="text-primary">{t("activities.individual.title1") as string}</span>{" "}
                {t("activities.individual.title2") as string}
              </h2>
              <p className="text-gray-400">
                {t("activities.individual.description") as string}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-secondary border-0">
                  <CardContent className="p-4 flex items-start space-x-4">
                    <Calendar className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-white font-medium text-white">
                        {t("activities.individual.scheduling") as string}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("activities.individual.appointmentBased") as string}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-0">
                  <CardContent className="p-4 flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-white font-medium text-white">
                        {t("activities.individual.duration") as string}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("activities.individual.hourPerSession") as string}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-0">
                  <CardContent className="p-4 flex items-start space-x-4">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-white font-medium text-white">
                        {t("activities.individual.format") as string}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("activities.individual.formatDescription") as string}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-0">
                  <CardContent className="p-4 flex items-start space-x-4">
                    <Target className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="text-white font-medium text-white">
                        {t("activities.individual.analysis") as string}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("activities.individual.analysisDescription") as string}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="bg-primary text-secondary hover:bg-primary/90"
                >
                  <Link href={`/${lang}/reservation-individuelle`}>
                    {t("activities.individual.bookSession") as string}{" "}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-secondary mb-4">
              {t("activities.cta.title") as string}
            </h2>
            <p className="text-secondary/80 mb-8">
              {t("activities.cta.description") as string}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90"
                asChild
              >
                <Link href={`/${lang}/contact`}>
                  {t("activities.cta.button") as string}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
