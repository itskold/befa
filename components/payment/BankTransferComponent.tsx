"use client";

import { BanknoteIcon, InfoIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Reservation } from "@/lib/types";

interface BankTransferComponentProps {
  onComplete: () => void;
  reservation: Omit<Reservation, "createdAt" | "updatedAt">;
  playerData: { firstName: string; lastName: string; email: string };
  activityData: any;
}

export const BankTransferComponent = ({
  onComplete,
  reservation,
  playerData,
  activityData,
}: BankTransferComponentProps) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const sendBankTransferEmail = async () => {
    setIsSendingEmail(true);
    try {
      // Dans un cas réel, ici nous appellerions une API pour envoyer l'email
      console.log(
        "Envoi d'un email avec les instructions de virement à:",
        playerData.email
      );

      // Simulation de l'envoi d'email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Email envoyé !",
        description:
          "Les instructions de virement ont été envoyées à votre adresse email.",
      });

      onComplete();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast({
        title: "Erreur d'envoi",
        description:
          "Une erreur s'est produite lors de l'envoi de l'email. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
      <div className="text-center">
        <BanknoteIcon className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-white text-xl font-bold text-white mb-2">
          Paiement par virement bancaire
        </h3>
        <p className="text-gray-300 mb-4">
          Veuillez effectuer un virement bancaire avec les informations
          suivantes:
        </p>
      </div>

      <div className="bg-secondary/70 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-400">Bénéficiaire:</p>
          <p className="text-white font-medium">BEFA Academy</p>

          <p className="text-gray-400">IBAN:</p>
          <p className="text-white font-medium">BE12 3456 7890 1234</p>

          <p className="text-gray-400">BIC:</p>
          <p className="text-white font-medium">GEBABEBB</p>

          <p className="text-gray-400">Montant:</p>
          <p className="text-white font-medium">
            {reservation.payment.amount}€
          </p>

          <p className="text-gray-400">Communication:</p>
          <p className="text-white font-medium">
            BEFA-{playerData.lastName.toUpperCase()}-{reservation.id}
          </p>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 p-3 rounded-md">
        <p className="text-sm text-primary">
          <InfoIcon className="h-4 w-4 inline-block mr-1" />
          Ce mail ne confirme pas votre réservation. Votre inscription sera
          confirmée uniquement après réception du paiement.
        </p>
      </div>

      <Button
        className="w-full bg-primary text-secondary hover:bg-primary/90"
        onClick={sendBankTransferEmail}
        disabled={isSendingEmail}
      >
        {isSendingEmail ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Recevoir les instructions par email"
        )}
      </Button>
    </div>
  );
};
