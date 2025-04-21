"use server";

import {
  EmailService,
  sendEmail as sendEmailImpl,
  sendConfirmationEmail as sendConfirmationEmailImpl,
  sendContactConfirmationClientEmail as sendContactConfirmationClientEmailImpl,
  sendContactConfirmationAdminEmail as sendContactConfirmationAdminEmailImpl,
  sendSponsoringConfirmationClientEmail as sendSponsoringConfirmationClientEmailImpl,
  sendSponsoringConfirmationAdminEmail as sendSponsoringConfirmationAdminEmailImpl,
  type EmailOptions,
} from "./emailServiceImplementation";

// Utiliser l'instance en interne mais ne pas l'exporter
const emailServiceInstance = new EmailService();

/**
 * Envoie un email en utilisant un template HTML
 * @param options Options de l'email
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  return sendEmailImpl(options);
}

/**
 * Envoie un email de confirmation d'inscription
 * @param to Adresse email du destinataire
 * @param variables Variables pour le template
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendConfirmationEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return sendConfirmationEmailImpl(to, variables);
}

/**
 * Envoie un email de confirmation de contact au client
 * @param to Adresse email du destinataire
 * @param variables Variables pour le template
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendContactConfirmationClientEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return sendContactConfirmationClientEmailImpl(to, variables);
}

/**
 * Envoie un email de notification de contact à l'administrateur
 * @param to Adresse email de l'administrateur
 * @param variables Variables pour le template
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendContactConfirmationAdminEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return sendContactConfirmationAdminEmailImpl(to, variables);
}

/**
 * Envoie un email de confirmation de sponsoring au client
 * @param to Adresse email du destinataire
 * @param variables Variables pour le template
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendSponsoringConfirmationClientEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return sendSponsoringConfirmationClientEmailImpl(to, variables);
}

/**
 * Envoie un email de notification de sponsoring à l'administrateur
 * @param to Adresse email de l'administrateur
 * @param variables Variables pour le template
 * @returns Promesse résolue quand l'email est envoyé
 */
export async function sendSponsoringConfirmationAdminEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return sendSponsoringConfirmationAdminEmailImpl(to, variables);
}
