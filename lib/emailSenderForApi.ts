import { sendConfirmationEmail } from "./emailServiceImplementation";

/**
 * Version pour l'API de la fonction d'envoi d'email de confirmation
 */
export async function envoyerEmailConfirmationForApi(
  email: string,
  prenom: string,
  nombreSeances: number,
  lieu: string,
  categorie: string,
  heureDebut: string,
  heureFin: string,
  jourSemaine: string,
  datesSeances: string[],
  equipementSupplementaire?: string[]
) {
  console.log("Début de envoyerEmailConfirmationForApi");
  console.log("Dates reçues:", datesSeances);

  // Préparation des dates - avec gestion d'erreur
  let datesSeancesArray: string[] = [];
  try {
    datesSeancesArray = Array.isArray(datesSeances) && datesSeances.length > 0
      ? datesSeances
      : ["Dates à confirmer"];
  } catch (error) {
    console.error("Erreur lors du traitement des dates:", error);
    datesSeancesArray = ["Dates à confirmer"];
  }

  // Préparation de l'équipement supplémentaire avec gestion d'erreur
  let equipementArray: string[] = [];
  try {
    equipementArray = Array.isArray(equipementSupplementaire) && equipementSupplementaire.length > 0
      ? equipementSupplementaire
      : [];
  } catch (error) {
    console.error("Erreur lors du traitement de l'équipement:", error);
    equipementArray = [];
  }

  try {
    // Validation supplémentaire de l'email
    if (
      !email ||
      typeof email !== "string" ||
      email.trim() === "" ||
      !email.includes("@")
    ) {
      console.error("Email invalide:", email);
      return {
        success: false,
        error: "Email invalide",
      };
    }

    console.log("Appel de sendConfirmationEmail avec:", {
      email,
      prenom,
      nombreSeances: nombreSeances || 0,
      datesSeances: datesSeancesArray,
    });

    // On utilise directement l'instance sans passer par les fonctions serveur
    await sendConfirmationEmail(email, {
      prenom: prenom || "Client",
      nombre_seances: nombreSeances || 0,
      lieu: lieu || "À confirmer",
      categorie: categorie || "À confirmer",
      heure_debut: heureDebut || "À confirmer",
      heure_fin: heureFin || "À confirmer",
      jour_semaine: jourSemaine || "À confirmer",
      dates_seances: datesSeancesArray,
      equipement_supplementaire: equipementArray,
    });

    console.log(`Email de confirmation envoyé à ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
