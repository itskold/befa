"use server";

import {
  sendConfirmationEmail,
  sendEmailWithTemplate,
  sendContactConfirmationClient,
  sendContactConfirmationAdmin,
  sendSponsoringConfirmationClient,
  sendSponsoringConfirmationAdmin
} from "./sendEmailWithTemplate";

/**
 * Script d'exemple montrant comment envoyer un email de confirmation
 */
export async function envoyerEmailConfirmation(
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
  // Préparation des dates sous forme de liste HTML
  const datesSeancesHtml = datesSeances
    .map((date) => `<li>${date}</li>`)
    .join("");

  // Préparation de l'équipement supplémentaire sous forme de liste HTML
  const equipementHtml = equipementSupplementaire
    ? equipementSupplementaire.map((item) => `<li>${item}</li>`).join("")
    : "";

  try {
    await sendConfirmationEmail(email, {
      prenom,
      nombre_seances: nombreSeances,
      lieu,
      categorie,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      jour_semaine: jourSemaine,
      dates_seances: datesSeancesHtml,
      equipement_supplementaire: equipementHtml,
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

/**
 * Envoie des emails après une soumission de formulaire de contact
 */
export async function envoyerEmailsContact(
  prenom: string,
  nom: string,
  email: string,
  telephone: string,
  message: string,
  adminEmail: string = process.env.CONTACT_ADMIN_EMAIL || "info@befa-academy.be"
) {
  const date = new Date().toLocaleDateString("fr-BE");
  const annee = new Date().getFullYear().toString();

  const variables = {
    prenom,
    nom,
    email,
    telephone,
    message,
    date,
    annee
  };

  try {
    // Email au client
    await sendContactConfirmationClient(email, variables);
    
    // Email à l'administrateur
    await sendContactConfirmationAdmin(adminEmail, variables);

    console.log(`Emails de contact envoyés - client: ${email}, admin: ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails de contact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Envoie des emails après une soumission de formulaire de sponsoring
 */
export async function envoyerEmailsSponsoring(
  entreprise: string,
  prenom: string,
  nom: string,
  fonction: string,
  email: string,
  telephone: string,
  formule: string,
  message: string,
  adminEmail: string = process.env.SPONSORING_ADMIN_EMAIL || "info@befa-academy.be"
) {
  const date = new Date().toLocaleDateString("fr-BE");
  const annee = new Date().getFullYear().toString();

  const variables = {
    entreprise,
    prenom,
    nom,
    fonction,
    email,
    telephone,
    formule,
    message,
    date,
    annee
  };

  try {
    // Email au client
    await sendSponsoringConfirmationClient(email, variables);
    
    // Email à l'administrateur
    await sendSponsoringConfirmationAdmin(adminEmail, variables);

    console.log(`Emails de sponsoring envoyés - client: ${email}, admin: ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails de sponsoring:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
