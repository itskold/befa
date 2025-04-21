import { NextResponse } from "next/server";
import { envoyerEmailConfirmationForApi } from "@/lib/emailSenderForApi";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      prenom,
      nombreSeances,
      lieu,
      categorie,
      heureDebut,
      heureFin,
      jourSemaine,
      datesSeances,
      equipementSupplementaire,
    } = body;

    // Validation basique
    if (!email || !prenom || email.trim() === "" || prenom.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Données manquantes: email ou prénom requis" },
        { status: 400 }
      );
    }

    // S'assurer que datesSeances est un tableau
    const datesFormattees = Array.isArray(datesSeances)
      ? datesSeances
      : datesSeances
      ? [datesSeances]
      : [];

    // S'assurer que equipementSupplementaire est un tableau
    const equipementFormate = Array.isArray(equipementSupplementaire)
      ? equipementSupplementaire
      : equipementSupplementaire
      ? [equipementSupplementaire]
      : [];

    console.log("Email data:", {
      email,
      prenom,
      nombreSeances,
      datesFormattees,
    });

    // Envoyer l'email
    const result = await envoyerEmailConfirmationForApi(
      email,
      prenom,
      nombreSeances || 0,
      lieu || "",
      categorie || "",
      heureDebut || "",
      heureFin || "",
      jourSemaine || "",
      datesFormattees,
      equipementFormate
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
