import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion, // Forcer le type
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      );
    }

    // Récupérer la session de paiement
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Vérifier le statut du paiement
    const paymentStatus =
      session.payment_status === "paid" ? "complete" : "incomplete";

    return NextResponse.json(
      {
        status: paymentStatus,
        session_id: sessionId,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_intent: session.payment_intent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la vérification du paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du paiement" },
      { status: 500 }
    );
  }
}
