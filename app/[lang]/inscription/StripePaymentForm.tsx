"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard, BanknoteIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./page";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export const StripePaymentForm = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const stripe = useStripe();
  const elements = useElements();

  // Initialiser le paiement lorsque le formulaire est affiché
  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);

        // Récupérer le montant total du formulaire
        const totalPrice = form.getValues("equipmentIncluded")
          ? parseInt(form.getValues("activityOption").split("-")[1] || "0") *
            100
          : 0;

        // Créer une intention de paiement côté serveur
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
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
        toast({
          title: "Erreur de paiement",
          description:
            "Impossible d'initialiser le paiement. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [form]);

  // Fonction pour confirmer le paiement
  const confirmPayment = async () => {
    if (!stripe || !elements) {
      return { success: false, error: "Le système de paiement n'est pas prêt" };
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/inscription/confirmation",
      },
      redirect: "if_required",
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Erreur de paiement",
        paymentIntentId: null,
      };
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      return {
        success: true,
        error: null,
        paymentIntentId: paymentIntent.id,
      };
    }

    return {
      success: false,
      error: "Le paiement n'a pas été confirmé",
      paymentIntentId: null,
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 rounded-md bg-secondary/50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p className="text-white">Chargement du système de paiement...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4 p-4 rounded-md bg-secondary/50">
        <div className="text-white">
          Le système de paiement n'a pas pu être initialisé. Veuillez actualiser
          la page ou réessayer plus tard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-md bg-secondary/50">
      <h4 className="font-medium text-white">Détails du paiement</h4>

      {/* Onglets de méthodes de paiement */}
      <div className="mb-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="grid grid-cols-2 gap-2"
        >
          <div
            className={`border ${
              paymentMethod === "card" ? "border-primary" : "border-gray-700"
            } rounded-md p-3 flex items-center justify-center cursor-pointer`}
          >
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <label
              htmlFor="card"
              className="flex items-center cursor-pointer w-full"
            >
              <CreditCard
                className={`h-5 w-5 mr-2 ${
                  paymentMethod === "card" ? "text-primary" : "text-gray-400"
                }`}
              />
              <span
                className={
                  paymentMethod === "card" ? "text-primary" : "text-gray-400"
                }
              >
                Carte de crédit/débit
              </span>
            </label>
          </div>

          <div
            className={`border ${
              paymentMethod === "bancontact"
                ? "border-primary"
                : "border-gray-700"
            } rounded-md p-3 flex items-center justify-center cursor-pointer`}
          >
            <RadioGroupItem
              value="bancontact"
              id="bancontact"
              className="sr-only"
            />
            <label
              htmlFor="bancontact"
              className="flex items-center cursor-pointer w-full"
            >
              <BanknoteIcon
                className={`h-5 w-5 mr-2 ${
                  paymentMethod === "bancontact"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <span
                className={
                  paymentMethod === "bancontact"
                    ? "text-primary"
                    : "text-gray-400"
                }
              >
                Bancontact
              </span>
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Éléments Stripe */}
      <div className="bg-secondary/70 p-4 rounded-md">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "bancontact"],
            defaultValues: {
              billingDetails: {
                name: `${form.getValues().firstName} ${
                  form.getValues().lastName
                }`,
                email: form.getValues().email,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
