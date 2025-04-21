"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { envoyerEmailsSponsoring } from "@/lib/emailSender";
import { useClientTranslation } from "@/utils/i18n";
import { useParams } from "next/navigation";
import i18next from "i18next";

// Définir le type pour les traductions
export type SponsorshipFormTranslations = {
  title: string;
  success: {
    title: string;
    description: string;
    button: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
  formSchema: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    position: string;
    package: string;
    message10: string;
    message500: string;
    consent: string;
  };
  formuleLabels: {
    supporter: string;
    champion: string;
    elite: string;
    legend: string;
    custom: string;
  };
  companyName: string;
  companyNamePlaceholder: string;
  contactName: string;
  contactNamePlaceholder: string;
  position: string;
  positionPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  package: string;
  packagePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  budget: string;
  budgetPlaceholder: string;
  consent: string;
  loading: string;
  submit: string;
};

interface SponsorshipFormProps {
  translations?: SponsorshipFormTranslations;
}

export default function SponsorshipForm({ translations }: SponsorshipFormProps) {
  const { lang } = useParams();
  const { t, isLoaded: i18nLoaded } = useClientTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Utiliser directement l'état de chargement du hook useClientTranslation
    if (i18nLoaded && !isLoaded) {
      console.log(`[SponsorshipForm] i18n est chargé, langue: ${lang}`);
      // Vérifier si les traductions sont disponibles
      console.log(`[SponsorshipForm] Test de traduction: ${t("sponsoring.form.form.title")}`);
      console.log(`[SponsorshipForm] Langue courante: ${i18next.language}`);
      console.log(`[SponsorshipForm] Langues disponibles: ${i18next.languages}`);
      setIsLoaded(true);
    }
  }, [i18nLoaded, isLoaded, lang, t]);

  // Définition du schéma de validation avec des valeurs par défaut pour éviter des clés vides
  const formSchema = z.object({
    companyName: z.string().min(2, {
      message: translations?.formSchema.companyName || "Le nom de l'entreprise doit contenir au moins 2 caractères",
    }),
    contactName: z.string().min(2, {
      message: translations?.formSchema.contactName || "Le nom du contact doit contenir au moins 2 caractères",
    }),
    email: z
      .string()
      .email({ message: translations?.formSchema.email || "Veuillez entrer une adresse email valide" }),
    phone: z.string().min(9, {
      message: translations?.formSchema.phone || "Le numéro de téléphone doit contenir au moins 9 chiffres",
    }),
    position: z
      .string()
      .min(2, { message: translations?.formSchema.position || "La fonction doit contenir au moins 2 caractères" }),
    package: z.string({
      required_error: translations?.formSchema.package || "Veuillez sélectionner une formule",
    }),
    message: z
      .string()
      .min(10, { message: translations?.formSchema.message10 || "Le message doit contenir au moins 10 caractères" })
      .max(500, { message: translations?.formSchema.message500 || "Le message ne doit pas dépasser 500 caractères" }),
    budget: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, {
      message: translations?.formSchema.consent || "Vous devez accepter la politique de confidentialité",
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Remplacer la fonction de simulation par la fonction réelle
  async function submitSponsorshipForm(data: FormValues) {
    try {
      // Traduire les valeurs du package
      const formuleLabels: Record<string, string> = {
        supporter: translations?.formuleLabels.supporter || "Formule Supporter - 650€/an",
        champion: translations?.formuleLabels.champion || "Formule Champion - 1.650€/an",
        elite: translations?.formuleLabels.elite || "Formule Élite - 2.750€/an",
        legende: translations?.formuleLabels.legend || "Formule Légende - 3.450€/an",
        custom: translations?.formuleLabels.custom || "Formule personnalisée"
      };

      const result = await envoyerEmailsSponsoring(
        data.companyName || "",
        // Diviser le nom complet en prénom et nom
        data.contactName.split(" ")[0] || "",
        data.contactName.split(" ").slice(1).join(" ") || "",
        data.position || "",
        data.email || "",
        data.phone || "",
        formuleLabels[data.package] || data.package,
        data.message || ""
      );
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      position: "",
      package: "",
      message: "",
      budget: "",
      consent: false,
    },
  });

  // Gérer la soumission du formulaire
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      const result = await submitSponsorshipForm(data);

      if (result.success) {
        setIsSuccess(true);
        form.reset();
        toast({
          title: translations?.success.title || "Demande envoyée !",
          description: translations?.success.description || "Nous vous contacterons dans les plus brefs délais pour discuter de votre partenariat.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: translations?.error.title || "Erreur",
        description: translations?.error.description || "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
        action: (
          <ToastAction altText={translations?.error.retry || "Réessayer"} onClick={() => onSubmit(data)}>
            {translations?.error.retry || "Réessayer"}
          </ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-secondary rounded-xl p-6 md:p-8">
      <h2 className="text-white text-2xl font-bold mb-6">
        {translations?.title || "Demande de partenariat"}
      </h2>

      {isSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <svg
              className="h-8 w-8 text-primary"
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className=" text-xl font-medium text-white mb-2">
            {translations?.success.title || "Demande envoyée avec succès !"}
          </h3>
          <p className="text-gray-400 mb-6">
            {translations?.success.description || "Merci de votre intérêt pour un partenariat avec BEFA Academy. Notre équipe vous contactera dans les plus brefs délais pour discuter des possibilités de partenariat adaptées à vos besoins et objectifs."}
          </p>
          <Button onClick={() => setIsSuccess(false)}>
            {translations?.success.button || "Envoyer une autre demande"}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {translations?.companyName || "Nom de l'entreprise"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={translations?.companyNamePlaceholder || "Entrez le nom de votre entreprise"} {...field} className="text-white"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {translations?.contactName || "Nom du contact"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.contactNamePlaceholder || "Entrez votre nom complet"} {...field} className="text-white"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {translations?.position || "Position"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.positionPlaceholder || "Votre position dans l'entreprise"} {...field} className="text-white"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {translations?.email || "Email"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={translations?.emailPlaceholder || "Entrez votre adresse email"}
                        {...field}
                        className="text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {translations?.phone || "Téléphone"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.phonePlaceholder || "Entrez votre numéro de téléphone"} {...field} className="text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {translations?.package || "Formule de partenariat"}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-white">
                        <SelectValue placeholder={translations?.packagePlaceholder || "Sélectionnez une formule"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="supporter">
                        {translations?.formuleLabels.supporter || "Formule Supporter - 650€/an"}
                      </SelectItem>
                      <SelectItem value="champion">
                        {translations?.formuleLabels.champion || "Formule Champion - 1.650€/an"}
                      </SelectItem>
                      <SelectItem value="elite">
                        {translations?.formuleLabels.elite || "Formule Élite - 2.750€/an"}
                      </SelectItem>
                      <SelectItem value="legende">
                          {translations?.formuleLabels.legend || "Formule Légende - 3.450€/an"}
                      </SelectItem>
                      <SelectItem value="custom">
                        {translations?.formuleLabels.custom || "Formule personnalisée"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {translations?.message || "Message"}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={translations?.messagePlaceholder || "Partagez-nous votre intérêt ou vos questions"} 
                      {...field} 
                      className="text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    {translations?.budget || "Budget"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={translations?.budgetPlaceholder || "Indiquez votre budget approximatif"} 
                      {...field} 
                      className="text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-secondary/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      {translations?.consent || "J'accepte la politique de confidentialité"}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-secondary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations?.loading || "Envoi en cours..."}
                </>
              ) : (
                translations?.submit || "Envoyer"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
