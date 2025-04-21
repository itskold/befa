"use client";

import { HandCoins, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/lib/types";
import { HelpInfo } from "@/components/payment/HelpInfo";
interface CashPaymentComponentProps {
  onComplete: () => void;
  reservation: Omit<Reservation, "createdAt" | "updatedAt">;
}

export const CashPaymentComponent = ({
  onComplete,
  reservation,
}: CashPaymentComponentProps) => {
  return (
    <>
      <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
        <div className="text-center">
          <HandCoins className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-white text-xl font-bold text-white mb-2">
            Paiement en espèces
          </h3>
          <p className="text-gray-300">
            Votre inscription a été enregistrée. Veuillez prévoir le montant
            exact de {reservation.payment.amount}€ pour le premier jour
            d'activité.
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/30 p-3 rounded-md">
          <p className="text-sm text-primary">
            <InfoIcon className="h-4 w-4 inline-block mr-1" />
            Votre place est en attente de paiement, mais l'inscription ne sera
            définitivement confirmée qu'après réception du paiement.
          </p>
        </div>

        <Button
          className="w-full bg-primary text-secondary hover:bg-primary/90"
          onClick={onComplete}
        >
          Confirmer l'inscription
        </Button>
      </div>
      <HelpInfo />
    </>
  );
};
