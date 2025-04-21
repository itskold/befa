"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { fr, nl } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useClientTranslation } from "@/utils/i18n";
import { useParams } from "next/navigation";

// Définir le type pour les traductions
export type ReservationFormTranslations = {
  title: string;
  subtitle: string;
  subtitle2: string;
  sessionType: string;
  duration: string;
  date: string;
  datePlaceholder: string;
  time: string;
  timePlaceholder: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  age: string;
  agePlaceholder: string;
  level: string;
  levelPlaceholder: string;
  levels: {
    debutant: string;
    intermediaire: string;
    avance: string;
    professionnel: string;
  };
  objectives: string;
  objectivesPlaceholder: string;
  total: string;
  payment: string;
  button: string;
  loading: string;
  sessionTypes: {
    technique: string;
    tactique: string;
    physique: string;
    gardien: string;
  };
  durations: {
    "60": string;
    "90": string;
    "120": string;
  };
  success: {
    title: string;
    subtitle: string;
    subtitle2: string;
    description: string;
    button: string;
  };
  cancel: string;
  validationErrors: {
    missingInfo: string;
    missingFields: string;
  };
};

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

interface ReservationFormProps {
  translations?: ReservationFormTranslations;
}

export default function ReservationForm({ translations }: ReservationFormProps) {
  const { lang } = useParams();
  const { t } = useClientTranslation();
  
  // Initialiser les types de session avec les traductions
  const sessionTypes = [
    { id: "technique", name: translations?.sessionTypes.technique || "Technique individuelle", price: 45 },
    { id: "tactique", name: translations?.sessionTypes.tactique || "Tactique de jeu", price: 50 },
    { id: "physique", name: translations?.sessionTypes.physique || "Préparation physique", price: 55 },
    { id: "gardien", name: translations?.sessionTypes.gardien || "Entraînement gardien", price: 60 },
  ];

  // Initialiser les durées avec les traductions
  const durations = [
    { value: "60", label: translations?.durations["60"] || "60 minutes", multiplier: 1 },
    { value: "90", label: translations?.durations["90"] || "90 minutes", multiplier: 1.4 },
    { value: "120", label: translations?.durations["120"] || "120 minutes", multiplier: 1.8 },
  ];
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [sessionType, setSessionType] = useState<string>("technique");
  const [duration, setDuration] = useState<string>("60");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    level: "",
    objectives: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedSession = sessionTypes.find((type) => type.id === sessionType);
  const selectedDuration = durations.find((d) => d.value === duration);

  const calculatePrice = () => {
    if (!selectedSession || !selectedDuration) return 0;
    return Math.round(selectedSession.price * selectedDuration.multiplier);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!date || !timeSlot || !sessionType || !duration) {
      toast({
        title: translations?.validationErrors.missingInfo || "Information manquante",
        description: translations?.validationErrors.missingFields || "Veuillez sélectionner une date, une heure, un type de session et une durée.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      toast({
        title: translations?.validationErrors.missingInfo || "Information manquante",
        description: translations?.validationErrors.missingFields || "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: translations?.success.title || "Réservation envoyée !",
      description: translations?.success.description || "Nous vous contacterons prochainement pour confirmer votre session.",
    });
  };

  return (
    <Card className="bg-secondary border-0 shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle>{translations?.title || "Formulaire de réservation"}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-white font-medium">
                {translations?.subtitle || "1. Choisissez votre séance"}
              </h3>

              <div className="space-y-2">
                <Label htmlFor="sessionType">{translations?.sessionType || "Type de séance"}</Label>
                <RadioGroup
                  value={sessionType}
                  onValueChange={setSessionType}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {sessionTypes.map((type) => (
                    <div key={type.id} className="relative">
                      <RadioGroupItem
                        value={type.id}
                        id={type.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={type.id}
                        className="flex justify-between p-3 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <span>{type.name}</span>
                        <span className="font-semibold">{type.price}€</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">{translations?.duration || "Durée de la séance"}</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Sélectionnez une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{translations?.date || "Date souhaitée"}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP", { locale: lang === "fr" ? fr : nl })
                        ) : (
                          <span>{translations?.datePlaceholder || "Sélectionnez une date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date.getDay() === 0
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">{translations?.time || "Heure souhaitée"}</Label>
                  <Select
                    value={timeSlot}
                    onValueChange={setTimeSlot}
                    disabled={!date}
                  >
                    <SelectTrigger id="time">
                      <SelectValue placeholder={translations?.timePlaceholder || "Sélectionnez une heure"} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{time}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h3 className="text-white font-medium">{translations?.subtitle2 || "2. Vos coordonnées"}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{translations?.firstName || "Prénom"}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={translations?.firstNamePlaceholder || "Votre prénom"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{translations?.lastName || "Nom"}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={translations?.lastNamePlaceholder || "Votre nom"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{translations?.email || "Email"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={translations?.emailPlaceholder || "Votre email"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{translations?.phone || "Téléphone"}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={translations?.phonePlaceholder || "Votre numéro de téléphone"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{translations?.age || "Âge"}</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder={translations?.agePlaceholder || "Votre âge"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">{translations?.level || "Niveau"}</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder={translations?.levelPlaceholder || "Sélectionnez votre niveau"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debutant">{translations?.levels.debutant || "Débutant"}</SelectItem>
                      <SelectItem value="intermediaire">
                        {translations?.levels.intermediaire || "Intermédiaire"}
                      </SelectItem>
                      <SelectItem value="avance">
                        {translations?.levels.avance || "Avancé"}
                      </SelectItem>
                      <SelectItem value="professionnel">
                        {translations?.levels.professionnel || "Professionnel"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives">{translations?.objectives || "Objectifs spécifiques"}</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleInputChange}
                  placeholder={translations?.objectivesPlaceholder || "Décrivez vos objectifs ou besoins spécifiques pour cette séance"}
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{translations?.total || "Montant total estimé"}:</span>
                  <span className="text-xl font-bold text-primary">
                    {calculatePrice()}€
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {translations?.payment || "Le paiement s'effectue sur place avant la séance"}
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-secondary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? translations?.loading || "Envoi en cours..." : translations?.button || "Réserver ma séance"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold">
              {translations?.success.title || "Demande envoyée avec succès !"}
            </h3>
            <p className="text-gray-500">
              {translations?.success.subtitle || "Nous avons bien reçu votre demande de réservation pour une séance"}
              {selectedSession?.name} {translations?.success.subtitle2 || "de"} {selectedDuration?.label}.
            </p>
            <p className="text-gray-500">
              {translations?.success.description || "Notre équipe vous contactera dans les plus brefs délais pour confirmer votre réservation."}
            </p>
            <Button
              className="mt-4 bg-primary text-secondary hover:bg-primary/90"
              onClick={() => {
                setIsSuccess(false);
                setDate(undefined);
                setTimeSlot(undefined);
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  age: "",
                  level: "",
                  objectives: "",
                });
              }}
            >
              {translations?.success.button || "Réserver une autre séance"}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 flex justify-center">
        <p>
          {translations?.cancel || "Vous pouvez annuler ou modifier votre réservation jusqu'à 24h avant la séance"}
        </p>
      </CardFooter>
      <Toaster />
    </Card>
  );
}
