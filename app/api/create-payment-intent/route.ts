import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    // Debug - vérifier que la clé Stripe est bien définie
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY n'est pas définie");
      return NextResponse.json(
        { error: "Configuration Stripe manquante" },
        { status: 500 }
      );
    }

    // Récupérer les données de la requête
    const { amount, currency, payment_method_types } = await req.json();

    console.log("Données reçues:", { amount, currency, payment_method_types });

    if (!amount || !currency) {
      console.error("Montant ou devise manquant:", { amount, currency });
      return NextResponse.json(
        { error: "Le montant et la devise sont requis" },
        { status: 400 }
      );
    }

    // S'assurer que le montant est un nombre et qu'il est au moins égal à 50 centimes
    const validAmount = Math.max(Math.round(amount), 50);
    console.log("Montant validé:", validAmount);

    // Créer une intention de paiement
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: validAmount,
        currency: currency.toLowerCase(),
        payment_method_types: payment_method_types || ["card"],
        metadata: {
          source: "BEFA Academy Inscription",
        },
      });

      console.log(
        "Intention de paiement créée avec succès, ID:",
        paymentIntent.id
      );

      // Retourner le client_secret pour initialiser Stripe Elements
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (stripeError: any) {
      console.error("Erreur Stripe spécifique:", {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
      });

      return NextResponse.json(
        {
          error:
            "Erreur lors de la création de l'intention de paiement dans Stripe",
          details: stripeError.message,
          code: stripeError.code,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(
      "Erreur générale lors de la création de l'intention de paiement:",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur lors de la création de l'intention de paiement",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
