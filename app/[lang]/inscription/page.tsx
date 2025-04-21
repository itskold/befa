import { Suspense } from "react"
import { getI18n } from "@/utils/server-i18n"
import { activitiesService, groupsService, sessionsService } from "@/lib/firebaseService"
import type { Activity, Group } from "@/lib/types"
import { daysOfWeek } from "@/lib/utils"
import InscriptionForm from "@/components/inscription/inscription-form"
import InscriptionLoading from "@/components/inscription/inscription-loading"
import { Timestamp } from "firebase/firestore"

// Fonction pour sérialiser les objets Firebase pour éviter l'erreur de passage des Server Components vers Client Components
function serializeData(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Timestamp) {
    // Convertir Timestamp en objet Date puis en string ISO
    return obj.toDate().toISOString();
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeData(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializeData(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
}

// Type étendu pour l'activité avec les sessions
interface ActivityWithSessions extends Activity {
  sessions: {
    id: string
    numberOfSessions: number
    pricePerSession: number
    equipmentIncluded: boolean
    totalPrice: number
    name?: string
  }[]
  price?: number
  title?: string
  ageGroups?: string[]
}

// Type étendu pour le groupe avec des propriétés additionnelles
interface GroupWithExtras extends Group {
  day?: string
  endTime?: string
  currentPlayers?: number
}

// Fonction pour récupérer une activité par son ID
async function getActivityById(id: string): Promise<ActivityWithSessions | null> {
  const activity = await activitiesService.getById(id)
  const sessions = await sessionsService.getByActivity(id)
  const groups = await groupsService.getByActivityId(id)


  if (!activity) return null

  // Convertir l'Activity en ActivityWithSessions
  return {
    ...activity,
    sessions: sessions.map((session) => ({
      ...session,
      id: session.id || "",
      numberOfSessions: session.numberOfSessions || 1,
      pricePerSession: session.pricePerSession || 0,
      totalPrice: (session.numberOfSessions || 1) * (session.pricePerSession || 0),
    })),
    price:
      sessions && sessions.length > 0
        ? Math.min(...sessions.map((session) => session.pricePerSession * session.numberOfSessions))
        : 0, // Prix minimum parmi toutes les sessions ou 0 si aucune session
    ageGroups: [...new Set(groups.map((group) => group.name))],
  }
}



// Fonction pour récupérer toutes les activités
async function getAllActivities(): Promise<ActivityWithSessions[]> {
  const allActivities = await activitiesService.getAll()
  const extendedActivitiesPromises = allActivities.map(async (act) => {
    const sessions = await sessionsService.getByActivity(act.id)
    const groups = await groupsService.getByActivityId(act.id)

    return {
      ...act,
      sessions: sessions.map((session) => ({
        ...session,
        id: session.id || "",
        numberOfSessions: session.numberOfSessions || 1,
        pricePerSession: session.pricePerSession || 0,
        totalPrice: (session.numberOfSessions || 1) * (session.pricePerSession || 0),
      })),
      price:
        sessions && sessions.length > 0
          ? Math.min(...sessions.map((session) => session.pricePerSession * session.numberOfSessions))
          : 0,
      ageGroups: [...new Set(groups.map((group) => group.name))],
    }
  })

  return Promise.all(extendedActivitiesPromises)
}

export default async function InscriptionPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { t } = await getI18n(lang) as { t: (key: string) => string }
  const activityId = typeof searchParams.activity === "string" ? searchParams.activity : null

  // Fonction pour récupérer les groupes par activité
async function getGroupsByActivityId(activityId: string): Promise<GroupWithExtras[]> {
  const activity = await activitiesService.getById(activityId)
  const groups = await groupsService.getByActivityId(activityId)

  // Convertir les groupes pour ajouter les propriétés supplémentaires
  return groups.map((group) => ({
    ...group,
    day: daysOfWeek.find((day) => day.id === activity?.specificDays[0])?.label[lang as "fr" | "nl"],
    endTime: group.startTime
      ? (() => {
          const [hours, minutes] = group.startTime.split(":").map(Number)
          const duration = activity?.duration || 0

          const totalMinutes = hours * 60 + minutes + duration
          const newHours = Math.floor(totalMinutes / 60)
          const newMinutes = totalMinutes % 60

          return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
        })()
      : "18:00",
    currentPlayers: group.players?.length || 0,
  }))
}

  // Récupérer toutes les activités
  const activities = await getAllActivities()

  // Si un ID d'activité est fourni, récupérer les détails
  let activity = null
  let groups: GroupWithExtras[] = []

  if (activityId) {
    activity = await getActivityById(activityId)
    if (activity) {
      groups = await getGroupsByActivityId(activityId)
    }
  }

  // Sérialiser les données pour éviter l'erreur "Only plain objects can be passed to Client Components from Server Components"
  const serializedActivity = activity ? serializeData(activity) : null
  const serializedGroups = serializeData(groups)
  const serializedActivities = serializeData(activities)

  return (
    <div className="flex flex-col min-h-screen bg-foreground">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
              {t("inscription.title")} <span className="text-primary">{t("inscription.academy")}</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              {activity
                ? `${t("inscription.subtitle")} "${activity.titleFr}"`
                : activityId
                  ? t("inscription.loading")
                  : t("inscription.chooseActivity")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Formulaire d'inscription */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <Suspense fallback={<InscriptionLoading />}>
            <InscriptionForm
              activity={serializedActivity}
              groups={serializedGroups}
              activities={serializedActivities}
              activityId={activityId}
              lang={lang}
            />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
