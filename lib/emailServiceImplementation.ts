import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export interface EmailOptions {
  to: string;
  subject: string;
  templatePath: string;
  variables: Record<string, any>;
  cc?: string[];
  bcc?: string[];
  from?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultSender: string;

  constructor() {
    // Configuration du transporteur SMTP
    const emailHost = process.env.EMAIL_HOST || "smtp.example.com";
    const emailPort = parseInt(process.env.EMAIL_PORT || "587");
    const emailSecure = process.env.EMAIL_SECURE === "true";
    const emailUser = process.env.EMAIL_USER || "";
    const emailPassword = process.env.EMAIL_PASSWORD || "";
    const emailSender = (
      process.env.EMAIL_DEFAULT_SENDER || "info@befa-academy.be"
    ).trim();

    console.log("Configuration SMTP:", {
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      user: emailUser ? "***" : "(vide)",
      pass: emailPassword ? "***" : "(vide)",
      sender: emailSender,
    });

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    this.defaultSender = emailSender;
  }

  /**
   * Envoie un email en utilisant un template HTML
   * @param options Options de l'email
   * @returns Promesse résolue quand l'email est envoyé
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Lecture du fichier template
      const templateFilePath = path.resolve(
        process.cwd(),
        options.templatePath
      );
      console.log("Template path:", templateFilePath);
      console.log("Template exists:", fs.existsSync(templateFilePath));

      const template = fs.readFileSync(templateFilePath, "utf-8");
      console.log("Template loaded, length:", template.length);

      // Compilation du template avec Handlebars
      const compiledTemplate = Handlebars.compile(template);
      const html = compiledTemplate(options.variables);
      console.log(
        "Template compiled with variables:",
        Object.keys(options.variables)
      );

      // Configuration de l'email
      const mailOptions = {
        from: options.from || this.defaultSender,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        html: html,
      };

      // Envoi de l'email
      await this.transporter.sendMail(mailOptions);
      console.log(`Email envoyé à ${options.to}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
  }

  /**
   * Envoie un email de confirmation d'inscription
   * @param to Adresse email du destinataire
   * @param variables Variables pour le template
   * @returns Promesse résolue quand l'email est envoyé
   */
  async sendConfirmationEmail(
    to: string,
    variables: Record<string, any>
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject: "Confirmation d'inscription - BEFA Academy",
      templatePath: "emails/confirmation-template.html",
      variables,
    });
  }

  /**
   * Envoie un email de confirmation de contact au client
   * @param to Adresse email du destinataire
   * @param variables Variables pour le template
   * @returns Promesse résolue quand l'email est envoyé
   */
  async sendContactConfirmationClientEmail(
    to: string,
    variables: Record<string, any>
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject: "Confirmation de votre demande de contact - BEFA Academy",
      templatePath: "emails/contact-confirmation-client.html",
      variables,
    });
  }

  /**
   * Envoie un email de notification de contact à l'administrateur
   * @param to Adresse email de l'administrateur
   * @param variables Variables pour le template
   * @returns Promesse résolue quand l'email est envoyé
   */
  async sendContactConfirmationAdminEmail(
    to: string,
    variables: Record<string, any>
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject: "Nouvelle demande de contact - BEFA Academy",
      templatePath: "emails/contact-confirmation-admin.html",
      variables,
    });
  }

  /**
   * Envoie un email de confirmation de sponsoring au client
   * @param to Adresse email du destinataire
   * @param variables Variables pour le template
   * @returns Promesse résolue quand l'email est envoyé
   */
  async sendSponsoringConfirmationClientEmail(
    to: string,
    variables: Record<string, any>
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject: "Confirmation de votre demande de sponsoring - BEFA Academy",
      templatePath: "emails/sponsoring-confirmation-client.html",
      variables,
    });
  }

  /**
   * Envoie un email de notification de sponsoring à l'administrateur
   * @param to Adresse email de l'administrateur
   * @param variables Variables pour le template
   * @returns Promesse résolue quand l'email est envoyé
   */
  async sendSponsoringConfirmationAdminEmail(
    to: string,
    variables: Record<string, any>
  ): Promise<void> {
    return this.sendEmail({
      to,
      subject: "Nouvelle demande de sponsoring - BEFA Academy",
      templatePath: "emails/sponsoring-confirmation-admin.html",
      variables,
    });
  }
}

// Singleton pour le service d'email
export const emailServiceInstance = new EmailService();

// Ajouter une fonction sendConfirmationEmail autonome en plus de la méthode de la classe
export async function sendConfirmationEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return emailServiceInstance.sendConfirmationEmail(to, variables);
}

// Également exporter sendEmail pour pouvoir l'utiliser directement
export async function sendEmail(options: EmailOptions): Promise<void> {
  return emailServiceInstance.sendEmail(options);
}

// Fonctions autonomes pour les emails de contact et sponsoring
export async function sendContactConfirmationClientEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return emailServiceInstance.sendContactConfirmationClientEmail(to, variables);
}

export async function sendContactConfirmationAdminEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return emailServiceInstance.sendContactConfirmationAdminEmail(to, variables);
}

export async function sendSponsoringConfirmationClientEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return emailServiceInstance.sendSponsoringConfirmationClientEmail(to, variables);
}

export async function sendSponsoringConfirmationAdminEmail(
  to: string,
  variables: Record<string, any>
): Promise<void> {
  return emailServiceInstance.sendSponsoringConfirmationAdminEmail(to, variables);
}
