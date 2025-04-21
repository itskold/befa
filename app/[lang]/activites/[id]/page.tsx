import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  MapPin,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  activitiesService,
  groupsService,
  sessionsService,
} from "@/lib/firebaseService";
import { getI18n } from '@/utils/server-i18n';

// Fonction pour récupérer une activité par son ID
function getActivityById(id: string) {
  return activitiesService.getById(id);
}

// Fonction pour rendre le HTML en JSX sécurisé
function createMarkup(html: string) {
  return { __html: html };
}

// Composant pour afficher les détails d'une activité
export default async function ActivityDetailPage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
  // Récupération des traductions pour la langue courante
  const { t } = await getI18n(lang) as { t: (key: string) => string };
  
  const activity = await getActivityById(id);
  const groups = await groupsService.getByActivityId(id);
  const sessions = await sessionsService.getByActivity(id);
  const activitiesData = await activitiesService.getAll();
  
  // Si l'activité n'existe pas, afficher une page 404
  if (!activity) {
    notFound();
  }

  // Ajout du champ activityId
  const activityId = id;

  // Fonction pour rendre l'icône appropriée
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Calendar":
        return <Calendar className="h-5 w-5 text-primary" />;
      case "Clock":
        return <Clock className="h-5 w-5 text-primary" />;
      case "Users":
        return <Users className="h-5 w-5 text-primary" />;
      case "Target":
        return <Target className="h-5 w-5 text-primary" />;
      case "Award":
        return <Award className="h-5 w-5 text-primary" />;
      default:
        return <Calendar className="h-5 w-5 text-primary" />;
    }
  };

  // Déterminer le titre et la description en fonction de la langue
  const title = lang === 'fr' ? activity.titleFr : activity.titleNl || activity.titleFr;
  const subtitle = lang === 'fr' ? activity.subtitleFr : activity.subtitleNl || activity.subtitleFr;
  const description = lang === 'fr' ? activity.descriptionFr : activity.descriptionNl || activity.descriptionFr;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <Badge className="bg-primary text-secondary mb-2">
                {t("activities.regular")}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                {title}
              </h1>
              <p className="text-gray-400">{subtitle}</p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-secondary hover:bg-primary/90 mt-4"
              >
                <Link href={`/${lang}/inscription?activity=${activityId}`}>
                  {t("home.cta.button")}{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={activity.imageUrl || "/images/hero-player-new.png"}
                  alt={title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Informations détaillées */}
      <section className="py-16 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-white text-2xl font-bold mb-4 text-white">
                  {t("activities.aboutActivity")}
                </h2>
                <div
                  className="prose prose-invert max-w-none text-gray-400 space-y-4"
                  dangerouslySetInnerHTML={createMarkup(description)}
                />
              </div>

              <div>
                <h2 className="text-white text-2xl font-bold mb-4 text-white text-white">
                  {t("activities.groupsSchedules")}
                </h2>
                <div className="bg-secondary/30 rounded-xl p-6">
                  <div className="space-y-3">
                    {groups
                      .slice()
                      .sort((a, b) => {
                        const ageA = parseInt(a.name.replace("U", ""));
                        const ageB = parseInt(b.name.replace("U", ""));
                        return ageA - ageB;
                      })
                      .map((group) => (
                        <div
                          key={group.id}
                          className="flex justify-between items-center border-b border-gray-700 pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {group.name}
                            </p>
                          </div>
                          <div className="text-primary font-medium">
                            {(() => {
                              const [hours, minutes] = group.startTime
                                .split(":")
                                .map(Number);
                              const startMinutes = hours * 60 + minutes;
                              const endMinutes =
                                startMinutes + activity.duration;
                              const endHours = Math.floor(endMinutes / 60);
                              const endMins = endMinutes % 60;
                              return `${group.startTime} - ${endHours
                                .toString()
                                .padStart(2, "0")}:${endMins
                                .toString()
                                .padStart(2, "0")}`;
                            })()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {activity.dates && activity.dates.length > 0 && (
                <div>
                  <h2 className="text-white text-2xl font-bold mb-4 text-white text-white">
                    {t("activities.sessionDates")}
                  </h2>
                  <div className="bg-secondary/30 rounded-xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {activity.dates.map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 rounded-lg bg-secondary/50 border border-gray-700"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-gray-300">{date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-secondary border-0">
                <CardContent className="p-6">
                  <h3 className="text-white text-xl font-bold mb-4 text-white text-white">
                    {t("activities.practicalInfo")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-white">
                          {t("activities.location")}
                        </p>
                        <p className="text-sm text-gray-400">
                          KSC Grimbergen, Brusselsesteenweg 170, <br />
                          1850 Grimbergen
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-white">
                          {t("activities.period")}
                        </p>
                        <p className="text-sm text-gray-400">
                          {activity.dates[0]} -{" "}
                          {activity.dates[activity.dates.length - 1]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-primary mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-white">
                          {t("activities.age")}
                        </p>
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
                              : t("activities.allAges");
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary border-0 mt-6">
                <CardContent className="p-6">
                  <h3 className="text-white text-xl font-bold mb-4 text-white">
                    {t("activities.sessionPackages")}
                  </h3>
                  <div className="space-y-4">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          index === 1
                            ? "border-primary bg-primary/10"
                            : "border-gray-700 bg-secondary/50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-white">
                            {session.name}
                          </h4>
                          {(() => {
                            // Trouver la session dont le nombre est le plus proche de la longueur des dates
                            const closestSession = sessions.reduce(
                              (prev, curr) =>
                                Math.abs(
                                  curr.numberOfSessions - activity.dates.length
                                ) <
                                Math.abs(
                                  prev.numberOfSessions - activity.dates.length
                                )
                                  ? curr
                                  : prev
                            );

                            return (
                              session.id === closestSession.id && (
                                <span className="bg-primary text-secondary text-xs px-2 py-1 rounded-full">
                                  {t("sponsoring.formules.elite.badge")}
                                </span>
                              )
                            );
                          })()}
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                          <p className="text-sm text-gray-400">
                            {session.numberOfSessions} x{" "}
                            {session.pricePerSession}€
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {session.pricePerSession * session.numberOfSessions}
                            €
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {session.pricePerSession}€ {t("activities.perSession")}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    className="w-full mt-4 bg-primary text-secondary hover:bg-primary/90"
                  >
                    <Link href={`/${lang}/inscription?activity=${activityId}`}>
                      {t("activities.choosePackage")}{" "}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-secondary rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 text-white">
                  {t("activities.features")}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {t("activities.frequency")}
                      </p>
                      <p className="text-sm text-gray-400">
                        {activity.specificDays.length} {t("activities.sessionsPerWeek")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {t("activities.duration")}
                      </p>
                      <p className="text-sm text-gray-400">
                        {activity.duration} {t("activities.minutesPerSession")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-primary text-secondary hover:bg-primary/90"
                size="lg"
              >
                <Link href={`/${lang}/inscription?activity=${activityId}`}>
                  {t("activities.registerActivity")}{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <div className="bg-secondary/30 rounded-xl p-6">
                <h3 className="text-white text-lg font-medium mb-2">
                  {t("activities.needInfo")}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {t("activities.contactUs")}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                >
                  <Link href={`/${lang}/contact`}>{t("activities.contactButton")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autres activités */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-white text-2xl font-bold mb-8">
            {t("activities.otherActivities")}
          </h2>
          {activitiesData.filter((a) => a.id != activity.id).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activitiesData
                .filter((a) => a.id != activity.id)
                .slice(0, 3)
                .map((relatedActivity) => (
                  <Card
                    key={relatedActivity.id}
                    className="bg-secondary border-0 overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={
                          relatedActivity.imageUrl ||
                          "/images/hero-player-new.png"
                        }
                        alt={lang === 'fr' ? relatedActivity.titleFr : relatedActivity.titleNl || relatedActivity.titleFr}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <Badge className="bg-primary text-secondary mb-1">
                          {t("activities.regular")}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {lang === 'fr' ? relatedActivity.titleFr : relatedActivity.titleNl || relatedActivity.titleFr}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {lang === 'fr' ? relatedActivity.subtitleFr : relatedActivity.subtitleNl || relatedActivity.subtitleFr}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10"
                      >
                        <Link href={`/${lang}/activites/${relatedActivity.id}`}>
                          {t("activities.learnMore")}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-2">
                {t("activities.noOtherActivities")}
              </p>
              <Button
                asChild
                className="bg-primary text-secondary hover:bg-primary/90 mt-2"
              >
                {/* <Link href={`/${lang}/activites`}>{dictionary.activities?.viewAll || "Voir toutes nos activités"}</Link> */}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-secondary mb-4">
              {t("activities.cta.title")}
            </h2>
            <p className="text-secondary/80 mb-8">
              {t("activities.cta.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90"
              >
                <Link href={`/${lang}/inscription?activity=${activityId}`}>
                  {t("home.cta.button")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-secondary bg-primary text-secondary hover:bg-primary/80 hover:text-secondary"
              >
                <Link href={`/${lang}/contact`}>{t("activities.contactButton")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
