"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { StripePaymentForm } from "./StripePaymentForm";
import { FormValues } from "./page";

// Initialiser Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export const StripeWrapper = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le secret client lors du montage du composant
    const fetchClientSecret = async () => {
      try {
        const totalAmount = form.getValues("equipmentIncluded")
          ? parseInt(form.getValues("activityOption").split("-")[1] || "0") *
            100
          : 0;

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "eur",
            payment_method_types: ["card", "bancontact"],
          }),
        });

        if (!response.ok) {
          throw new Error(
            "Erreur lors de la création de l'intention de paiement"
          );
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchClientSecret();
  }, [form]);

  if (!clientSecret) {
    return (
      <div className="p-4 text-center">
        Chargement du système de paiement...
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#f5f301",
            colorBackground: "#1e1f22",
            colorText: "#ffffff",
            colorDanger: "#ff4c4c",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      }}
    >
      <StripePaymentForm form={form} />
    </Elements>
  );
};
