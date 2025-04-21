import { NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion, // Forcer le type
});

export async function POST(request: Request) {
  try {
    const {
      reservationId,
      amount,
      email,
      description,
      groupId,
      playerId,
      activityId,
      sessionActivityId,
    } = await request.json();

    // Créer une session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Inscription BEFA Academy",
              description: description,
            },
            unit_amount: Math.round(amount * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}&groupId=${groupId}&playerId=${playerId}&activityId=${activityId}&sessionActivityId=${sessionActivityId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paiement/cancel?reservation_id=${reservationId}&groupId=${groupId}&playerId=${playerId}&activityId=${activityId}&sessionActivityId=${sessionActivityId}`,
      customer_email: email,
      metadata: {
        reservationId: reservationId,
      },
    });

    // Mettre à jour la réservation avec l'ID de session Stripe
    const reservationRef = doc(db, "reservations", reservationId);
    await updateDoc(reservationRef, {
      "payment.stripeSessionId": session.id,
      "payment.status": "processing",
      updatedAt: new Date(),
    });

    // Retourner l'URL de la session pour rediriger l'utilisateur
    return NextResponse.json({ sessionUrl: session.url }, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
