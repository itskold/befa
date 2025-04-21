"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Reservation } from "@/lib/types";
import { useRouter } from "next/navigation";

interface CashPaymentComponentProps {
  onComplete: () => void;
  reservation: Omit<Reservation, "createdAt" | "updatedAt">;
}

export const CardPaymentComponent = ({
  onComplete,
  reservation,
}: CashPaymentComponentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      console.log("Création du paiement pour la réservation:", reservation);

      // Créer une session de paiement Stripe
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          activityId: reservation.activityId,
          groupId: reservation.groupId,
          sessionActivityId: reservation.sessionId,
          playerId: reservation.playerId,
          amount: reservation.payment.amount,
          email: reservation.playerData?.email || "",
          description: `Inscription BEFA Academy - #${reservation.id}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de réponse API:", errorData);
        throw new Error("Erreur lors de la création de la session de paiement");
      }

      const data = await response.json();
      console.log("Réponse API de création de session:", data);

      // Rediriger vers la page de paiement Stripe
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("URL de session non fournie");
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);
      setIsProcessing(false);
      // En cas d'erreur, afficher un message à l'utilisateur
      alert(
        "Une erreur est survenue lors de la préparation du paiement. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
      <div className="text-center">
        <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-white text-xl font-bold text-white mb-2">
          Paiement par carte bancaire
        </h3>
        <p className="text-gray-300">
          Vous allez être redirigé vers notre plateforme de paiement sécurisée
          Stripe.
        </p>
      </div>
      <Button
        className="w-full bg-primary text-secondary hover:bg-primary/90"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Préparation du paiement...
          </>
        ) : (
          "Procéder au paiement"
        )}
      </Button>
    </div>
  );
};
