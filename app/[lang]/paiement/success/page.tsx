"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { HelpInfo } from "@/components/payment/HelpInfo";
import { daysOfWeek } from "@/lib/utils";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const reservationId = searchParams.get("reservation_id");
        const activityId = searchParams.get("activityId");
        const groupId = searchParams.get("groupId");
        const playerId = searchParams.get("playerId");
        const sessionActivityId = searchParams.get("sessionActivityId");
        if (
          !sessionId ||
          !reservationId ||
          !groupId ||
          !playerId ||
          !activityId ||
          !sessionActivityId
        ) {
          setError("Informations de paiement manquantes");
          setIsVerifying(false);
          return;
        }

        // Vérifier le statut du paiement auprès de Stripe via notre API
        const response = await fetch(
          `/api/verify-payment?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la vérification du paiement");
        }

        const data = await response.json();

        if (data.status === "complete") {
          // Mettre à jour le statut de la réservation dans Firebase
          const reservationRef = doc(db, "reservations", reservationId);
          const reservationSnap = await getDoc(reservationRef);

          const groupRef = doc(db, "groups", groupId);
          const groupSnap = await getDoc(groupRef);

          if (reservationSnap.exists()) {
            await updateDoc(reservationRef, {
              "payment.status": "completed",
              updatedAt: Timestamp.now(),
            });

            if (groupSnap.exists()) {
              const groupData = groupSnap.data();
              if (!groupData.players.includes(playerId)) {
                await updateDoc(groupRef, {
                  players: arrayUnion(playerId),
                  updatedAt: Timestamp.now(),
                });
              }
            }
            const activityRef = doc(db, "activities", activityId);
            const activitySnap = await getDoc(activityRef);
            const sessionRef = doc(db, "sessions", sessionActivityId);
            const sessionSnap = await getDoc(sessionRef);

            activitySnap.exists()
              ? console.log("activitySnap.exists()")
              : console.log("activitySnap.notExists()");
            reservationSnap.exists()
              ? console.log("reservationSnap.exists()")
              : console.log("reservationSnap.notExists()");
            groupSnap.exists()
              ? console.log("groupSnap.exists()")
              : console.log("groupSnap.notExists()");
            sessionSnap.exists()
              ? console.log("sessionSnap.exists()")
              : console.log("sessionSnap.notExists()");

            if (
              activitySnap.exists() &&
              reservationSnap.exists() &&
              groupSnap.exists() &&
              sessionSnap.exists()
            ) {
              const activityData = activitySnap.data();
              const reservationData = reservationSnap.data();
              const groupData = groupSnap.data();
              const sessionData = sessionSnap.data();

              // Vérifier les données de la réservation
              console.log("Données de réservation:", {
                email: reservationData.playerData.email,
                prenom: reservationData.playerData.name,
                reservationData: reservationData,
              });

              // Appel à l'API d'envoi d'email au lieu de l'appel direct
              const emailData = {
                email: reservationData.playerData.email || "",
                prenom: reservationData.playerData.name || "",
                nombreSeances: sessionData.numberOfSessions || 0,
                lieu: "KSC Grimbergen",
                categorie: groupData.name || "",
                heureDebut: groupData.startTime || "",
                heureFin: groupData.startTime
                  ? (() => {
                      const [hours, minutes] = groupData.startTime
                        .split(":")
                        .map(Number);
                      const duration = activityData?.duration || 0;

                      const totalMinutes = hours * 60 + minutes + duration;
                      const newHours = Math.floor(totalMinutes / 60);
                      const newMinutes = totalMinutes % 60;

                      return `${newHours
                        .toString()
                        .padStart(2, "0")}:${newMinutes
                        .toString()
                        .padStart(2, "0")}`;
                    })()
                  : groupData.startTime || "",
                jourSemaine:
                  daysOfWeek.find(
                    (day) => day.id === activityData?.specificDays[0]
                  )?.label.fr || "",
                datesSeances: activityData?.dates || [],
                equipementSupplementaire: [],
              };

              // Vérifier que les données obligatoires existent
              if (!emailData.email || !emailData.prenom) {
                console.error("Données email manquantes:", {
                  email: emailData.email,
                  prenom: emailData.prenom,
                });
              } else {
                // Debug des données
                console.log(
                  "Activity data:",
                  JSON.stringify({
                    dates: activityData?.dates,
                    email: reservationData.email,
                    nombreSeances: sessionData.numberOfSessions,
                  })
                );

                // Envoyer la requête à notre nouvelle API route
                try {
                  const emailResponse = await fetch(
                    "/api/send-confirmation-email",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(emailData),
                    }
                  );

                  if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.error(
                      "Erreur lors de l'envoi de l'email:",
                      errorData
                    );
                    // On continue quand même, l'échec de l'email ne doit pas bloquer le processus
                  } else {
                    console.log("Email envoyé avec succès!");
                  }
                } catch (emailError) {
                  console.error(
                    "Exception lors de l'envoi de l'email:",
                    emailError
                  );
                  // On continue quand même, l'échec de l'email ne doit pas bloquer le processus
                }
              }
            }

            setIsSuccess(true);
          } else {
            setError("Réservation introuvable");
          }
        } else {
          setError("Le paiement n'a pas été complété");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement:", error);
        setError("Une erreur est survenue lors de la vérification du paiement");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-foreground">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
              Vérification <span className="text-primary">du paiement</span>
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Formulaire d'inscription */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          {isVerifying ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-white text-xl font-semibold text-white mb-2">
                  Vérification du paiement en cours...
                </h2>
                <p className="text-gray-400">
                  Veuillez patienter pendant que nous vérifions votre paiement
                </p>
              </div>
              <HelpInfo />
            </div>
          ) : isSuccess ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-white text-2xl font-bold text-white mb-4">
                  Paiement réussi !
                </h2>
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Image
                      src="/images/befa-logo.png"
                      alt="BEFA Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-300 mb-4">
                    Votre inscription à BEFA Academy a été confirmée. Vous
                    recevrez un email avec tous les détails de votre
                    réservation.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-primary text-secondary hover:bg-primary/90 w-full"
                >
                  <Link href="/">Retour à l'accueil</Link>
                </Button>
              </div>
              <HelpInfo />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h2 className="text-white text-2xl font-bold text-white mb-4">
                  Erreur de paiement
                </h2>
                <p className="text-red-400 mb-6">{error}</p>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="bg-primary text-secondary hover:bg-primary/90 w-full"
                  >
                    <Link href="/inscription">Réessayer</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-secondary/80 w-full"
                  >
                    <Link href="/">Retour à l'accueil</Link>
                  </Button>
                </div>
              </div>
              <HelpInfo />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
