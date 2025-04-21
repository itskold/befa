"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, CreditCard, Loader2, CheckCircle2, InfoIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { promoCodesService } from "@/lib/firebaseService"
import type { Group, Reservation } from "@/lib/types"
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CardPaymentComponent } from "@/components/payment/CardPaymentComponent"
import { generateId } from "@/lib/utils"
import { HelpInfo } from "@/components/payment/HelpInfo"
import { OrderSummary } from "@/components/inscription/order-summary"
import { getI18n } from "@/utils/server-i18n"
import { Textarea } from "../ui/textarea"

// Mettre à jour le schéma de validation pour inclure les nouveaux champs
const formSchema = z.object({
  // Informations sur le joueur
  firstName: z.string().min(2, { message: "inscription.validation.firstNameRequired" }),
  lastName: z.string().min(2, { message: "inscription.validation.lastNameRequired" }),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "inscription.validation.birthDateInvalid",
  }),
  club: z.string({
    required_error: "inscription.validation.clubRequired",
  }),

  // Informations sur l'activité
  activityOption: z.string({
    required_error: "inscription.validation.activityRequired",
  }),
  groupId: z.string({
    required_error: "inscription.validation.groupRequired",
  }),

  // Informations sur le parent/tuteur
  email: z.string().email({ message: "inscription.validation.emailInvalid" }),
  phone1: z.string().min(10, { message: "inscription.validation.phoneInvalid" }),
  phone2: z.string().optional(),

  // Adresse
  address: z.string().min(1, { message: "inscription.validation.addressRequired" }),
  postalCode: z.string().min(4, { message: "inscription.validation.postalCodeInvalid" }),
  city: z.string().min(1, { message: "inscription.validation.cityRequired" }),

  // Informations médicales
  medicalInfo: z.string().optional(),

  // Options d'équipement
  equipmentIncluded: z.boolean(),
  tshirtSize: z.string().optional(),
  shortSize: z.string().optional(),

  // Code promo
  promoCode: z.string().optional(),

  // Paiement
  paymentMethod: z.enum(["stripe", "virement", "especes"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),

  // Consentements
  termsAccepted: z.boolean(),
  photoConsent: z.boolean(),
})

// Définir le type FormValues basé sur le schéma
export type FormValues = z.infer<typeof formSchema>

export default function InscriptionForm({
  activity: initialActivity,
  groups: initialGroups,
  activities: initialActivities,
  activityId: initialActivityId,
  lang,
}: {
  activity: any,
  groups: any,
  activities: any,
  activityId: any,
  lang: string,
}) {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key)

  // Charger les traductions
  useEffect(() => {
    const loadTranslations = async () => {
      const { t: translate } = await getI18n(lang)
      setT(() => translate as (key: string) => string)
    }
    loadTranslations()
  }, [lang])

  const searchParams = useSearchParams()
  const [activity, setActivity] = useState(initialActivity)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [groups, setGroups] = useState(initialGroups || [])
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [activities, setActivities] = useState(initialActivities || [])
  const [isLoading, setIsLoading] = useState(false)

  // Nombre total d'étapes dans le formulaire
  const totalSteps = 2

  // Ajouter des états pour gérer le code promo et le total
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [equipmentPrice, setEquipmentPrice] = useState(0)

  // Initialiser le formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      club: "",
      activityOption: "",
      groupId: "",
      email: "",
      phone1: "",
      phone2: "",
      address: "",
      postalCode: "",
      city: "",
      medicalInfo: "",
      equipmentIncluded: false,
      tshirtSize: "",
      shortSize: "",
      promoCode: "",
      paymentMethod: "stripe",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardName: "",
      termsAccepted: true,
      photoConsent: true,
    },
    mode: "onChange",
  })

  // Mettre à jour le groupe sélectionné lorsque l'utilisateur change de groupe
  useEffect(() => {
    const groupId = form.watch("groupId")
    if (groupId && groups.length > 0) {
      const group = groups.find((g: any) => g.id === groupId)
      if (group) {
        setSelectedGroup(group)
      }
    }
  }, [form.watch("groupId"), groups])

  // Mettre à jour le prix total lorsque l'activité ou l'équipement change
  useEffect(() => {
    if (activity) {
      const selectedOption = form.watch("activityOption")
      const includeEquipment = form.watch("equipmentIncluded")
      let sessionPack = false
      let basePrice = 0

      // Trouver le prix de l'option sélectionnée
      if (selectedOption && selectedOption.startsWith("package-")) {
        const packageIndex = Number.parseInt(selectedOption.split("-")[1])
        if (activity.sessions[packageIndex].equipmentIncluded) {
          sessionPack = true
          setEquipmentPrice(0)
          // Mise à jour automatique du champ lorsqu'un package avec équipement inclus est sélectionné
          if (!includeEquipment) {
            form.setValue("equipmentIncluded", true)
          }
        } else {
          sessionPack = false
          setEquipmentPrice(30)
        }
        if (activity.sessions && packageIndex !== undefined && activity.sessions[packageIndex]) {
          basePrice = activity.sessions[packageIndex].totalPrice
        }
      }

      // Ajouter le prix de l'équipement si sélectionné
      const equipPrice = includeEquipment ? (sessionPack ? 0 : 30) : 0
      setEquipmentPrice(equipPrice)

      // Calculer le total avec réduction
      const total = basePrice + equipPrice - promoDiscount
      setTotalPrice(Math.max(0, total))
    }
  }, [activity, form.watch("activityOption"), form.watch("equipmentIncluded"), promoDiscount])

  // Mettre à jour l'option sélectionnée quand elle change
  useEffect(() => {
    const option = form.watch("activityOption")
    if (option) {
      setSelectedOption(option)
    }
  }, [form.watch("activityOption")])

  // Mettre à jour les groupes lorsque l'utilisateur sélectionne une activité manuellement
  const handleActivitySelection = async (activityId: string) => {
    // Réinitialiser les champs liés à l'activité précédente
    form.setValue("activityOption", "")
    form.setValue("groupId", "")

    try {
      setIsLoading(true)

      // Trouver l'activité dans la liste des activités déjà chargées
      const selectedActivity = activities.find((act: any) => act.id === activityId)
      if (selectedActivity) {
        setActivity(selectedActivity)

        // Trouver les groupes pour cette activité
        const response = await fetch(`/api/groups?activityId=${activityId}`)
        if (response.ok) {
          const groupsData = await response.json()
          setGroups(groupsData)
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      toast({
        title: t("inscription.errors.loadingError"),
        description: t("inscription.errors.loadingErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour passer à l'étape suivante
  const goToNextStep = async () => {
    if (currentStep === 1) {
      // Vérifier si une activité est sélectionnée
      if (!activity) {
        toast({
          title: t("inscription.errors.activityMissing"),
          description: t("inscription.errors.activityMissingMessage"),
          variant: "destructive",
        })
        return
      }

      // Valider les champs de l'étape 1 avant de passer à l'étape 2
      const isValid = await form.trigger([
        "firstName",
        "lastName",
        "birthDate",
        "club",
        "activityOption",
        "groupId",
        "email",
        "phone1",
        "address",
        "postalCode",
        "city",
      ])

      if (isValid) {
        setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        toast({
          title: t("inscription.errors.incompleteForm"),
          description: t("inscription.errors.incompleteFormMessage"),
          variant: "destructive",
        })
      }
    }
  }

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Modification de la fonction onSubmit
  async function onSubmit(data: FormValues) {
    if (currentStep < totalSteps) {
      goToNextStep()
      return
    }

    setIsSubmitting(true)

    try {
      // Vérifier si le joueur existe déjà
      const playersRef = collection(db, "players")
      const emailQuery = query(playersRef, where("email", "==", data.email))
      const nameQuery = query(playersRef, where("name", "==", data.firstName), where("lastname", "==", data.lastName))

      const emailResults = await getDocs(emailQuery)
      const nameResults = await getDocs(nameQuery)

      let playerId = ""

      if (!emailResults.empty || !nameResults.empty) {
        // Le joueur existe déjà, mettre à jour ses informations
        const existingPlayer = !emailResults.empty ? emailResults.docs[0] : nameResults.docs[0]
        const playerData = existingPlayer.data() as {
          id: string
          name: string
          lastname: string
          dateOfBirth: Date
          email: string
          phone1: string
          phone2?: string
          address: {
            street: string
            postalCode: string
            city: string
          }
          club: string
          lang: "fr" | "nl"
          note: string
          groupIds: string[]
          activityIds: string[]
          sessions: string[]
          books: string[]
          createdAt: Date
          updatedAt: Date
        }
        playerId = playerData.id

        // Mettre à jour les tableaux d'activités, groupes et sessions du joueur
        const sessionId =
          activity?.sessions && selectedOption.startsWith("package-")
            ? activity.sessions[Number.parseInt(selectedOption.split("-")[1])].id
            : ""

        // Vérifier que les valeurs ne sont pas déjà dans les tableaux
        const activityIds = playerData.activityIds || []
        const groupIds = playerData.groupIds || []
        const sessions = playerData.sessions || []

        if (activity?.id && !activityIds.includes(activity.id)) {
          activityIds.push(activity.id)
        }

        if (!groupIds.includes(data.groupId)) {
          groupIds.push(data.groupId)
        }

        if (sessionId && !sessions.includes(sessionId)) {
          sessions.push(sessionId)
        }

        // Mettre à jour le document du joueur
        await setDoc(doc(db, "players", playerId), {
          ...playerData,
          activityIds,
          groupIds,
          sessions,
          updatedAt: new Date(),
        })

        console.log("Joueur existant mis à jour avec ID:", playerId)
      } else {
        // Créer un nouveau joueur
        playerId = generateId()

        const sessionId =
          activity?.sessions && selectedOption.startsWith("package-")
            ? activity.sessions[Number.parseInt(selectedOption.split("-")[1])].id
            : ""

        const newPlayer: {
          id: string
          name: string
          lastname: string
          dateOfBirth: Date
          email: string
          phone1: string
          phone2?: string
          address: {
            street: string
            postalCode: string
            city: string
          }
          club: string
          lang: "fr" | "nl"
          note: string
          groupIds: string[]
          activityIds: string[]
          sessions: string[]
          books: string[]
          createdAt: Date
          updatedAt: Date
        } = {
          id: playerId,
          name: data.firstName,
          lastname: data.lastName,
          dateOfBirth: new Date(data.birthDate),
          email: data.email,
          phone1: data.phone1,
          phone2: data.phone2,
          address: {
            street: data.address,
            postalCode: data.postalCode,
            city: data.city,
          },
          club: data.club,
          lang: lang as "fr" | "nl", // Utiliser la langue actuelle ou français par défaut
          note: data.medicalInfo || "",
          groupIds: [data.groupId],
          activityIds: activity?.id ? [activity.id] : [],
          sessions: sessionId ? [sessionId] : [],
          books: [], // Sera mis à jour après l'enregistrement de la réservation
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await setDoc(doc(db, "players", playerId), newPlayer)
        console.log("Nouveau joueur créé avec ID:", playerId)
      }

      // Créer un objet de réservation à partir des données du formulaire
      const reservationId = generateId()
      const reservation: Omit<Reservation, "id" | "createdAt" | "updatedAt"> = {
        sessionId:
          activity?.sessions && selectedOption.startsWith("package-")
            ? activity.sessions[Number.parseInt(selectedOption.split("-")[1])].id
            : "",
        sessionData:
          activity?.sessions && selectedOption.startsWith("package-")
            ? {
                numberOfSessions: activity.sessions[Number.parseInt(selectedOption.split("-")[1])].numberOfSessions,
                pricePerSession: activity.sessions[Number.parseInt(selectedOption.split("-")[1])].pricePerSession,
              }
            : undefined,
        dates: [], // À remplir avec les dates sélectionnées
        groupId: data.groupId,
        activityId: activity?.id || "",
        playerId: playerId, // ID du joueur existant ou nouvellement créé
        playerData: {
          name: data.firstName,
          lastname: data.lastName,
          email: data.email,
          phone: data.phone1,
        },

        equipmentIncluded: data.equipmentIncluded,
        shortSize: data.shortSize || "",
        tshirtSize: data.tshirtSize || "",
        payment: {
          amount: totalPrice,
          status: "pending",
          date: new Date(),
          paymentMethod: data.paymentMethod,
        },
      }

      if (promoDiscount > 0) {
        reservation.promoCode = {
          id: "",
          name: "",
          code: data.promoCode || "",
          amount: promoDiscount,
          type: "percentage" as const,
          usageCount: 0,
          createdAt: new Date(),
          validFrom: null,
          validUntil: null,
        }
      }

      console.log("Données de réservation:", reservation)

      // Enregistrer la réservation dans Firebase
      try {
        const reservationRef = await setDoc(doc(db, "reservations", reservationId), {
          id: reservationId,
          ...reservation,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // Mettre à jour le tableau books du joueur avec l'ID de la réservation
        await updateDoc(doc(db, "players", playerId), {
          books: arrayUnion(reservationId),
          sessions: arrayUnion(reservation.sessionId),
          groupIds: arrayUnion(reservation.groupId),
          activityIds: arrayUnion(reservation.activityId),
          updatedAt: new Date(),
        })

        console.log("Réservation enregistrée avec ID:", reservationId)

        // Définir les paramètres pour les différents composants de paiement
        setReservationData({
          reservationId: reservationId,
          reservation: {
            id: reservationId,
            ...reservation,
          },
          playerData: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        })

        // Afficher le composant de paiement approprié
        setShowPaymentComponent(true)
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la réservation:", error)
        throw error
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        title: t("inscription.errors.registrationError"),
        description: t("inscription.errors.registrationErrorMessage"),
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Dans le composant principal, ajoutez ces états
  const [showPaymentComponent, setShowPaymentComponent] = useState(false)
  const [reservationData, setReservationData] = useState<{
    reservationId: string
    reservation: Omit<Reservation, "createdAt" | "updatedAt">
    playerData: { firstName: string; lastName: string; email: string }
  } | null>(null)

  // Fonction pour terminer le processus de paiement
  const completePaymentProcess = () => {
    setIsSuccess(true)
    setShowPaymentComponent(false)
    form.reset()

    toast({
      title: t("inscription.success.title"),
      description: t("inscription.success.message"),
    })

    setIsSubmitting(false)
  }

  // Service pour vérifier l'existence d'un joueur
  const checkExistingPlayer = async (email: string, phone: string, lastName: string): Promise<boolean> => {
    try {
      // Chercher dans la collection players pour un joueur avec le même email, téléphone ou nom
      const playersRef = collection(db, "players")

      // Requête pour vérifier l'email
      const emailQuery = query(playersRef, where("email", "==", email))
      const emailResults = await getDocs(emailQuery)
      if (!emailResults.empty) return true

      // Requête pour vérifier le téléphone
      const phoneQuery = query(playersRef, where("phone", "==", phone))
      const phoneResults = await getDocs(phoneQuery)
      if (!phoneResults.empty) return true

      // Requête pour vérifier le nom de famille
      const lastNameQuery = query(playersRef, where("lastName", "==", lastName))
      const lastNameResults = await getDocs(lastNameQuery)
      if (!lastNameResults.empty) return true

      return false
    } catch (error) {
      console.error("Erreur lors de la vérification du joueur existant:", error)
      return false
    }
  }

  // Fonction pour vérifier le code promo
  const checkPromoCode = async (code: string | undefined) => {
    if (!code || code.trim() === "") {
      setPromoApplied(false)
      setPromoDiscount(0)
      return
    }

    try {
      // Chercher le code promo dans la base de données
      const promoCode = await promoCodesService.getByCode(code)

      if (!promoCode) {
        // Code promo non trouvé
        setPromoApplied(false)
        setPromoDiscount(0)
        toast({
          title: t("inscription.promo.invalid"),
          description: t("inscription.promo.invalidMessage"),
          variant: "destructive",
        })
        return
      }

      // Vérifier si le code promo est valide temporellement
      const now = new Date()
      if (promoCode.validFrom && now < promoCode.validFrom.toDate()) {
        setPromoApplied(false)
        setPromoDiscount(0)
        toast({
          title: t("inscription.promo.notYetValid"),
          description: t("inscription.promo.notYetValidMessage"),
          variant: "destructive",
        })
        return
      }

      if (promoCode.validUntil && now > promoCode.validUntil.toDate()) {
        setPromoApplied(false)
        setPromoDiscount(0)
        toast({
          title: t("inscription.promo.expired"),
          description: t("inscription.promo.expiredMessage"),
          variant: "destructive",
        })
        return
      }

      // Vérifier la limite d'utilisation
      if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
        setPromoApplied(false)
        setPromoDiscount(0)
        toast({
          title: t("inscription.promo.exhausted"),
          description: t("inscription.promo.exhaustedMessage"),
          variant: "destructive",
        })
        return
      }

      // Vérifier si le code promo est spécifique à une activité
      if (promoCode.activityId && activity?.id !== promoCode.activityId) {
        setPromoApplied(false)
        setPromoDiscount(0)
        toast({
          title: t("inscription.promo.notApplicable"),
          description: t("inscription.promo.notApplicableMessage"),
          variant: "destructive",
        })
        return
      }

      // Vérifier si le code promo est spécifique à un joueur
      if (promoCode.playerId) {
        // Vérifier si le joueur existe déjà avec les informations actuelles
        const formData = form.getValues()
        const playerExists = await checkExistingPlayer(formData.email, formData.phone1, formData.lastName)

        // Si le joueur existe, vérifier si le code promo lui est destiné
        if (playerExists && promoCode.playerId !== "ID_ATTENDU_DU_JOUEUR") {
          // À adapter
          setPromoApplied(false)
          setPromoDiscount(0)
          toast({
            title: t("inscription.promo.personal"),
            description: t("inscription.promo.personalMessage"),
            variant: "destructive",
          })
          return
        }
      }

      // Si nous arrivons ici, le code promo est valide
      setPromoApplied(true)

      // Calculer la réduction
      let discount = 0
      if (promoCode.type === "percentage") {
        // Réduction en pourcentage
        discount = Math.round((totalPrice * promoCode.amount) / 100)
      } else {
        // Réduction fixe
        discount = promoCode.amount
      }

      setPromoDiscount(discount)

      toast({
        title: t("inscription.promo.applied"),
        description: `${t("inscription.promo.applied")} ${discount}€.`,
      })
    } catch (error) {
      console.error("Erreur lors de la vérification du code promo:", error)
      setPromoApplied(false)
      setPromoDiscount(0)
      toast({
        title: t("inscription.promo.error"),
        description: t("inscription.promo.errorMessage"),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {isSuccess ? (
        <div className="max-w-3xl mx-auto bg-secondary rounded-xl p-8 text-center animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-white text-3xl font-bold text-white mb-4">{t("inscription.success.title")}</h2>
          <p className="text-gray-300 mb-6">{t("inscription.success.message")}</p>
          <p className="text-gray-400 mb-8">
            {t("inscription.success.contact")} <span className="text-primary">{t("inscription.success.email")}</span>{" "}
            {t("inscription.success.or")} <span className="text-primary">{t("inscription.success.phone")}</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-primary text-secondary hover:bg-primary/90">
              <Link href="/">{t("inscription.success.homeButton")}</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/activites">{t("inscription.success.activitiesButton")}</Link>
            </Button>
          </div>
          <HelpInfo />
        </div>
      ) : showPaymentComponent && reservationData ? (
        <div className="max-w-3xl mx-auto">
          <Card className="bg-secondary border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary/50 border-b border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl">{t("inscription.payment.title")}</CardTitle>
              <CardDescription>{t("inscription.payment.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {form.watch("paymentMethod") === "stripe" && (
                <CardPaymentComponent onComplete={completePaymentProcess} reservation={reservationData.reservation} />
              )}
            </CardContent>
          </Card>
          <HelpInfo />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-secondary border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary/50 border-b border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl">
                {currentStep === 1 ? t("inscription.form.step1Title") : t("inscription.form.step2Title")}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 ? t("inscription.form.step1Subtitle") : t("inscription.form.step2Subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Indicateur de progression */}
                  <div className="flex items-center justify-center mt-2 mb-6">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep >= 1 ? "bg-primary text-secondary" : "bg-secondary/50 text-gray-400"
                        }`}
                      >
                        1
                      </div>
                      <div className={`h-1 w-12 ${currentStep >= 2 ? "bg-primary" : "bg-secondary/50"}`}></div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep >= 2 ? "bg-primary text-secondary" : "bg-secondary/50 text-gray-400"
                        }`}
                      >
                        2
                      </div>
                    </div>
                  </div>
                 
                  {currentStep === 1 ? (
                    /* Étape 1: Informations */
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Informations sur l'activité */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">1</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.activity.title")}
                          </h3>
                        </div>

                        {isLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-3 text-gray-300">{t("inscription.loading")}</span>
                          </div>
                        ) : !activity ? (
                          <div className="space-y-4">
                            <div className="bg-secondary/50 rounded-lg p-4 flex items-center">
                              <InfoIcon className="h-5 w-5 text-primary mr-2" />
                              <p className="text-gray-400">{t("inscription.sections.activity.selectPrompt")}</p>
                            </div>

                            <div className="grid gap-4">
                              <label className="text-sm font-medium text-gray-300">
                                {t("inscription.sections.activity.chooseLabel")}
                              </label>
                              <select
                                className="w-full bg-secondary/50 border border-gray-700 rounded-md p-2 text-white"
                                onChange={(e) => handleActivitySelection(e.target.value)}
                              >
                                <option value="">{t("inscription.sections.activity.selectPlaceholder")}</option>
                                {activities.map((act: any) => (
                                  <option key={act.id} value={act.id}>
                                    {act.titleFr} - {act.price}€
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="bg-secondary/50 rounded-lg p-4 flex items-center">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                <Image
                                  src="/images/befa-logo.png"
                                  alt="BEFA Logo"
                                  width={30}
                                  height={30}
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-white">{activity?.titleFr}</p>
                                <p className="text-sm text-gray-400">
                                  {t("inscription.sections.activity.startingFrom")} {activity?.price ?? 0}€
                                </p>
                              </div>
                            </div>

                            {activity && (
                              <>
                                <FormField
                                  control={form.control}
                                  name="activityOption"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t("inscription.sections.activity.packageLabel")}</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-secondary/50 border-gray-700">
                                            <SelectValue
                                              placeholder={t("inscription.sections.activity.packagePlaceholder")}
                                            />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {activity.sessions.map((session: any, index: number) => (
                                            <SelectItem key={index} value={`package-${index}`}>
                                              {session.name} - {session.totalPrice}€ ({session.pricePerSession}
                                              {t("inscription.sections.activity.pricePerSession")})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {activity && groups.length > 0 && (
                                  <FormField
                                    control={form.control}
                                    name="groupId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t("inscription.sections.activity.groupLabel")}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger className="bg-secondary/50 border-gray-700">
                                              <SelectValue
                                                placeholder={t("inscription.sections.activity.groupPlaceholder")}
                                              />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {groups
                                              .sort((a: any, b: any) => {
                                                // Extraire les nombres des noms (ex: "U10" -> 10)
                                                const ageA = Number.parseInt(a.name.substring(1)) || 0
                                                const ageB = Number.parseInt(b.name.substring(1)) || 0
                                                return ageA - ageB
                                              })
                                              .map((group: any) => (
                                                <SelectItem key={group.id} value={group.id}>
                                                  {group.name} | {group.startTime.replace(":", "h")} -{" "}
                                                  {(() => {
          const [hours, minutes] = group.startTime.split(":").map(Number);
          const duration = activity?.duration || 0;

          const totalMinutes = hours * 60 + minutes + duration;
          const newHours = Math.floor(totalMinutes / 60);
          const newMinutes = totalMinutes % 60;

          return `${newHours.toString().padStart(2, "0")}:${newMinutes
            .toString()
            .padStart(2, "0")}`;
        })().replace(":", "h")}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>

                      {/* Informations sur le joueur */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">2</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.player.title")}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.player.firstName")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.player.firstNamePlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.player.lastName")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.player.lastNamePlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.player.birthDate")}</FormLabel>
                                <FormControl>
                                  <Input type="date" className="bg-secondary/50 border-gray-700" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="club"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.player.club")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.player.clubPlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Informations sur le parent/tuteur */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">3</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.parent.title")}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.parent.email")}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder={t("inscription.sections.parent.emailPlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.parent.phone")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.parent.phonePlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Adresse */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">4</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.address.title")}
                          </h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("inscription.sections.address.street")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("inscription.sections.address.streetPlaceholder")}
                                  className="bg-secondary/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.address.postalCode")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.address.postalCodePlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("inscription.sections.address.city")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.address.cityPlaceholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {/* Informations médicales */}
                      <div className="space-y-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                <span className="text-primary font-medium">
                                  5
                                </span>
                              </div>
                              <h3 className="text-lg font-medium text-white">
                                Informations médicales
                              </h3>
                            </div>

                            <FormField
                              control={form.control}
                              name="medicalInfo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Informations médicales importantes
                                    (allergies, médicaments, etc.)
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Veuillez indiquer toute information médicale importante dont les entraîneurs devraient être informés."
                                      className="min-h-[100px] bg-secondary/50 border-gray-700"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Ces informations resteront confidentielles.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Équipement */}
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                <span className="text-primary font-medium">
                                  6
                                </span>
                              </div>
                              <h3 className="text-white text-lg font-medium text-white">
                                Équipement
                              </h3>
                            </div>

                            <FormField
                              control={form.control}
                              name="equipmentIncluded"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-secondary/50">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                      }}
                                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Ajouter l'équipement officiel de BEFA
                                      Academy (
                                      {selectedOption &&
                                      selectedOption.startsWith("package-") &&
                                      activity?.sessions[
                                        Number.parseInt(
                                          selectedOption.split("-")[1]
                                        )
                                      ]?.equipmentIncluded
                                        ? "Inclus"
                                        : `${activity?.equipmentPrice || 30}€`}
                                      )
                                    </FormLabel>
                                    <FormDescription>
                                      Inclut un t-shirt et un short aux couleurs
                                      de l'académie
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            {form.watch("equipmentIncluded") && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md bg-secondary/50">
                                <FormField
                                  control={form.control}
                                  name="tshirtSize"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Taille du t-shirt</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-secondary/70 border-gray-700">
                                            <SelectValue placeholder="Sélectionnez une taille" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="6-8">
                                            6-8 ans
                                          </SelectItem>
                                          <SelectItem value="8-10">
                                            8-10 ans
                                          </SelectItem>
                                          <SelectItem value="10-12">
                                            10-12 ans
                                          </SelectItem>
                                          <SelectItem value="12-14">
                                            12-14 ans
                                          </SelectItem>
                                          <SelectItem value="XS">XS</SelectItem>
                                          <SelectItem value="S">S</SelectItem>
                                          <SelectItem value="M">M</SelectItem>
                                          <SelectItem value="L">L</SelectItem>
                                          <SelectItem value="XL">XL</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="shortSize"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Taille du short</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-secondary/70 border-gray-700">
                                            <SelectValue placeholder="Sélectionnez une taille" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="6-8">
                                            6-8 ans
                                          </SelectItem>
                                          <SelectItem value="8-10">
                                            8-10 ans
                                          </SelectItem>
                                          <SelectItem value="10-12">
                                            10-12 ans
                                          </SelectItem>
                                          <SelectItem value="12-14">
                                            12-14 ans
                                          </SelectItem>
                                          <SelectItem value="XS">XS</SelectItem>
                                          <SelectItem value="S">S</SelectItem>
                                          <SelectItem value="M">M</SelectItem>
                                          <SelectItem value="L">L</SelectItem>
                                          <SelectItem value="XL">XL</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                    </div>
                  ) : (
                    /* Étape 2: Paiement */
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Résumé de la commande */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">1</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.summary.title")}
                          </h3>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-4">
                          <OrderSummary
                            activity={activity}
                            selectedOption={form.watch("activityOption")}
                            selectedGroup={selectedGroup}
                            equipmentIncluded={form.watch("equipmentIncluded")}
                            promoDiscount={promoDiscount}
                            totalPrice={totalPrice}
                            lang={lang}
                            t={t}
                          />
                        </div>
                      </div>

                      {/* Code promo */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">2</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.promo.title")}
                          </h3>
                        </div>

                        <div className="flex space-x-2">
                          <FormField
                            control={form.control}
                            name="promoCode"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>{t("inscription.sections.promo.title")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("inscription.sections.promo.placeholder")}
                                    className="bg-secondary/50 border-gray-700"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="mt-8 border-primary text-primary hover:bg-primary/10"
                            onClick={() => checkPromoCode(form.watch("promoCode"))}
                          >
                            {t("inscription.sections.promo.apply")}
                          </Button>
                        </div>
                        {promoApplied && (
                          <div className="text-sm text-primary flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {t("inscription.sections.promo.applied")} {promoDiscount}€
                          </div>
                        )}
                      </div>

                      {/* Méthode de paiement */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">3</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.payment.title")}
                          </h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                  <FormItem className="flex flex-col items-center mt-0 rounded-lg p-4 border border-gray-700 bg-secondary/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10">
                                    <FormControl>
                                      <RadioGroupItem
                                        value="stripe"
                                        className="sr-only"
                                        checked={field.value === "stripe"}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex flex-column mt-0 items-center justify-center gap-2 flex-nowrap">
                                      <CreditCard
                                        className={`h-8 w-8 ${
                                          field.value === "stripe" ? "text-primary" : "text-gray-400"
                                        }`}
                                      />
                                      {t("inscription.sections.payment.online")}
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("paymentMethod") === "stripe" && (
                          <div className="p-4 rounded-md bg-secondary/50">
                            <p className="text-sm text-gray-300">{t("inscription.sections.payment.redirect")}</p>
                          </div>
                        )}
                      </div>

                      {/* Consentements */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <span className="text-primary font-medium">4</span>
                          </div>
                          <h3 className="text-white text-lg font-medium text-white">
                            {t("inscription.sections.consent.title")}
                          </h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-secondary/50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  {t("inscription.sections.consent.terms")}{" "}
                                  <Link href="#" className="text-primary hover:underline">
                                    {t("inscription.sections.consent.termsLink")}
                                  </Link>{" "}
                                  {t("inscription.sections.consent.and")}{" "}
                                  <Link href="#" className="text-primary hover:underline">
                                    {t("inscription.sections.consent.privacyLink")}
                                  </Link>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="photoConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-secondary/50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{t("inscription.sections.consent.photo")}</FormLabel>
                                <FormDescription>{t("inscription.sections.consent.photoOptional")}</FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between p-6 bg-secondary/50 border-t border-gray-700">
              {currentStep === 1 ? (
                <div className="flex w-full justify-end">
                  <Button
                    type="button"
                    className="bg-primary text-secondary hover:bg-primary/90 flex items-center"
                    onClick={goToNextStep}
                  >
                    {t("inscription.buttons.continue")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex w-full justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-secondary/80"
                    onClick={goToPreviousStep}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t("inscription.buttons.back")}
                  </Button>
                  <Button
                    type="button"
                    className="bg-primary text-secondary hover:bg-primary/90"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("inscription.buttons.processing")}
                      </>
                    ) : form.watch("paymentMethod") === "stripe" ? (
                      t("inscription.buttons.payment")
                    ) : (
                      t("inscription.buttons.confirm")
                    )}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          <HelpInfo />
        </div>
      )}
    </>
  )
}
