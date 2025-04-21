import { type NextRequest, NextResponse } from "next/server"
import { groupsService, activitiesService } from "@/lib/firebaseService"
import { daysOfWeek } from "@/lib/utils"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const activityId = searchParams.get("activityId")

  if (!activityId) {
    return NextResponse.json({ error: "Activity ID is required" }, { status: 400 })
  }

  try {
    const groups = await groupsService.getByActivityId(activityId)

    // Enrichir les groupes avec des informations supplémentaires
    const enrichedGroups = await Promise.all(
      groups.map(async (group) => {
        // Récupérer l'activité pour obtenir des informations supplémentaires
        const activity = await activitiesService.getById(activityId)

        return {
          ...group,
          day: daysOfWeek.find((day) => day.id === activity?.specificDays[0])?.label.fr,
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
        }
      }),
    )

    return NextResponse.json(enrichedGroups)
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}
