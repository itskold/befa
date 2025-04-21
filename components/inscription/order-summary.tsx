"use client"

import Image from "next/image"

export const OrderSummary = ({
  activity,
  selectedOption,
  selectedGroup,
  equipmentIncluded,
  promoDiscount,
  totalPrice,
  lang,
  t,
}: {
  activity: any
  selectedOption: string
  selectedGroup: any
  equipmentIncluded: boolean
  promoDiscount: number
  totalPrice: number
  lang: string
  t: (key: string) => string
}) => {
  if (!activity) return null

  const packageIndex = selectedOption.startsWith("package-") ? Number.parseInt(selectedOption.split("-")[1]) : -1

  const session = packageIndex >= 0 && activity.sessions[packageIndex] ? activity.sessions[packageIndex] : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Image src="/images/befa-logo.png" alt="BEFA Logo" width={24} height={24} className="object-contain" />
          </div>
          <div>
            <p className="font-medium text-white">{lang === "fr" ? activity.titleFr : activity.titleNl}</p>
            {session && <p className="text-sm text-gray-400">{session.label}</p>}
          </div>
        </div>
        <span className="font-medium text-white">{session ? `${session.totalPrice}€` : ""}</span>
      </div>

      {selectedGroup && (
        <div className="flex items-center justify-between py-2 border-t border-gray-700">
          <div>
            <p className="text-sm text-gray-300">{t("inscription.sections.summary.group")}</p>
            <p className="text-sm text-gray-400">
              {selectedGroup.name} - {selectedGroup.day ? `${selectedGroup.day}` : ""}
            </p>
          </div>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            {selectedGroup.startTime.replace(":", "h")} à {selectedGroup.endTime.replace(":", "h")}
          </span>
        </div>
      )}

      {equipmentIncluded && (
        <div className="flex items-center justify-between py-2 border-t border-gray-700">
          <div>
            <p className="text-sm text-gray-300">{t("inscription.sections.summary.equipment")}</p>
            <p className="text-sm text-gray-400">{t("inscription.sections.summary.equipmentDescription")}</p>
          </div>
          <span className="font-medium text-white">
            {session && session.equipmentIncluded
              ? t("inscription.sections.equipment.included")
              : activity.equipmentPrice + "€"}
          </span>
        </div>
      )}

      {promoDiscount > 0 && (
        <div className="flex items-center justify-between py-2 border-t border-gray-700">
          <div>
            <p className="text-sm text-gray-300">{t("inscription.sections.summary.discount")}</p>
            <p className="text-sm text-primary">{t("inscription.sections.summary.promoApplied")}</p>
          </div>
          <span className="font-medium text-primary">-{promoDiscount}€</span>
        </div>
      )}

      <div className="flex items-center justify-between py-3 border-t border-gray-700">
        <p className="font-medium text-white">{t("inscription.sections.summary.total")}</p>
        <span className="text-xl font-bold text-primary">{totalPrice}€</span>
      </div>
    </div>
  )
}
