import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { getI18n } from '@/utils/server-i18n';

export default async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  // Récupération des traductions pour la langue courante
  const { t } = await getI18n(lang) as { t: (key: string) => string };
  const formTranslations = {
    title: t("contact.form.title"),
    firstName: t("contact.form.firstName"),
    lastName: t("contact.form.lastName"),
    email: t("contact.form.email"),
    phone: t("contact.form.phone"),
    subject: t("contact.form.subject"),
    message: t("contact.form.message"),
    consent: t("contact.form.consent"),
    privacyPolicy: t("contact.form.privacyPolicy"),
    submit: t("contact.form.submit"),
    submitting: t("contact.form.submitting"),
    placeholders: {
      firstName: t("contact.form.placeholders.firstName"),
      lastName: t("contact.form.placeholders.lastName"),
      email: t("contact.form.placeholders.email"),
      phone: t("contact.form.placeholders.phone"),
      subject: t("contact.form.placeholders.subject"),
      message: t("contact.form.placeholders.message"),
    },
    subjectOptions: {
      information: t("contact.form.subjectOptions.information"),
      registration: t("contact.form.subjectOptions.registration"),
      partnership: t("contact.form.subjectOptions.partnership"),
      other: t("contact.form.subjectOptions.other"),
    },
    validation: {
      firstName: t("contact.form.validation.firstName"),
      lastName: t("contact.form.validation.lastName"),
      email: t("contact.form.validation.email"),
      phone: t("contact.form.validation.phone"),
      subject: t("contact.form.validation.subject"),
      message: t("contact.form.validation.message"),
      consent: t("contact.form.validation.consent"),
    },
    success: {
      title: t("contact.form.success.title"),
      description: t("contact.form.success.description"),
      button: t("contact.form.success.button"),
    },
    error: {
      title: t("contact.form.error.title"),
      description: t("contact.form.error.description"),
      retry: t("contact.form.error.retry"),
    },
    successMessage: {
      title: t("contact.form.successMessage.title"),
      description: t("contact.form.successMessage.description"),
      button: t("contact.form.successMessage.button"),
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
              {t("contact.hero.title") as string} <span className="text-primary">BEFA</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t("contact.hero.description") as string}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Formulaire et Informations */}
      <section className="py-16 bg-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <h2 className=" text-2xl font-bold mb-4 text-white">
                  {t("contact.info.title") as string}
                </h2>
                <p className="text-gray-400 mb-6">
                  {t("contact.info.description") as string}
                </p>
              </div>

              <div className="bg-secondary rounded-xl p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className=" text-white font-medium">{t("contact.phone.title") as string}</h3>
                    <p className="text-gray-400">+32 473 99 91 70</p>
                    <p className="text-sm text-gray-500">
                      {t("contact.phone.hours") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect height="16" rx="2" width="20" x="2" y="4" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{t("contact.email.title") as string}</h3>
                    <p className="text-gray-400">info@befa-academy.be</p>
                    <p className="text-sm text-gray-500">
                      {t("contact.email.response") as string}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{t("contact.address.title") as string}</h3>
                    <p className="text-gray-400">
                      KSC Grimbergen
                      <br />
                      Brusselsesteenweg 170
                      <br />
                      1850 Grimbergen
                    </p>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Formulaire de contact */}
            <div>
              <ContactForm translations={formTranslations} />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            {t("contact.map.title") as string}
          </h2>
          <div className="rounded-xl overflow-hidden h-[400px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2514.8200598243625!2d4.36282794763054!3d50.927045540807555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c27ee83ee9f3%3A0x530d06163cbe758d!2sKSC%20jeugd%20Grimbergen!5e0!3m2!1sfr!2sbe!4v1745024931569!5m2!1sfr!2sbe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte BEFA Academy"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
