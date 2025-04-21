"use server";

import {
  sendEmail,
  sendConfirmationEmail as sendConfirmationEmailService,
  sendContactConfirmationClientEmail as sendContactConfirmationClientEmailService,
  sendContactConfirmationAdminEmail as sendContactConfirmationAdminEmailService,
  sendSponsoringConfirmationClientEmail as sendSponsoringConfirmationClientEmailService,
  sendSponsoringConfirmationAdminEmail as sendSponsoringConfirmationAdminEmailService,
} from "./emailService";
import type { EmailOptions } from "./emailServiceImplementation";

interface ConfirmationEmailVariables {
  prenom: string;
  nombre_seances: number;
  lieu: string;
  categorie: string;
  heure_debut: string;
  heure_fin: string;
  jour_semaine: string;
  dates_seances: string;
  dates_exception?: string;
  equipement_supplementaire?: string;
}

/**
 * Interface pour les variables du template de contact
 */
interface ContactEmailVariables {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  date: string;
  annee: string;
}

/**
 * Interface pour les variables du template de sponsoring
 */
interface SponsoringEmailVariables {
  entreprise: string;
  prenom: string;
  nom: string;
  fonction: string;
  email: string;
  telephone: string;
  formule: string;
  message: string;
  date: string;
  annee: string;
}

/**
 * Fonction pour envoyer un email de confirmation d'inscription
 * @param to Adresse email du destinataire
 * @param variables Variables pour le template
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendConfirmationEmail(
  to: string,
  variables: ConfirmationEmailVariables
): Promise<void> {
  return sendConfirmationEmailService(to, variables);
}

/**
 * Fonction générique pour envoyer un email avec un template
 * @param to Adresse email du destinataire
 * @param subject Sujet de l'email
 * @param templatePath Chemin vers le fichier template
 * @param variables Variables pour le template
 * @param options Options supplémentaires (cc, bcc, from)
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendEmailWithTemplate(
  to: string,
  subject: string,
  templatePath: string,
  variables: Record<string, any>,
  options?: {
    cc?: string[];
    bcc?: string[];
    from?: string;
  }
): Promise<void> {
  return sendEmail({
    to,
    subject,
    templatePath,
    variables,
    ...options,
  });
}

/**
 * Envoie un email de confirmation au client après une demande de contact
 */
export async function sendContactConfirmationClient(
  to: string,
  variables: ContactEmailVariables
): Promise<void> {
  return sendContactConfirmationClientEmailService(to, variables);
}

/**
 * Envoie un email de notification à l'admin après une demande de contact
 */
export async function sendContactConfirmationAdmin(
  to: string,
  variables: ContactEmailVariables
): Promise<void> {
  return sendContactConfirmationAdminEmailService(to, variables);
}

/**
 * Envoie un email de confirmation au client après une demande de sponsoring
 */
export async function sendSponsoringConfirmationClient(
  to: string,
  variables: SponsoringEmailVariables
): Promise<void> {
  return sendSponsoringConfirmationClientEmailService(to, variables);
}

/**
 * Envoie un email de notification à l'admin après une demande de sponsoring
 */
export async function sendSponsoringConfirmationAdmin(
  to: string,
  variables: SponsoringEmailVariables
): Promise<void> {
  return sendSponsoringConfirmationAdminEmailService(to, variables);
}

// Exemple d'utilisation:
/*
// Pour un email de confirmation d'inscription
await sendConfirmationEmail('participant@example.com', {
  prenom: 'Jean',
  nombre_seances: 12,
  lieu: 'Terrain principal',
  categorie: 'U12',
  heure_debut: '14h00',
  heure_fin: '15h30',
  jour_semaine: 'mercredis',
  dates_seances: '<li>15 septembre 2024</li><li>22 septembre 2024</li><li>29 septembre 2024</li>',
  dates_exception: '25 décembre 2024',
  equipement_supplementaire: '<li>Vêtements de rechange</li>'
});

// Pour un autre type d'email avec template
await sendEmailWithTemplate(
  'contact@example.com',
  'Bienvenue chez BEFA Academy',
  'emails/welcome-template.html',
  { nom: 'Dupont', activite: 'Stage d\'été' }
);
*/
