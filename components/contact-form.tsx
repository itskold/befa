"use client";

import { useEffect, useState } from "react";
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
import { envoyerEmailsContact } from "@/lib/emailSender";

import { useClientTranslation } from "@/utils/i18n";
import { useParams } from "next/navigation";
import i18next from "i18next";

export type ContactFormTranslations = 
  {
    title: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
    consent: string,
    privacyPolicy: string,
    submit: string,
    submitting: string,
    placeholders: {
      firstName: string,
      lastName: string,
      email: string,
      phone: string,
      subject: string,
      message: string,
    },
    subjectOptions: {
      information: string,
      registration: string,
      partnership: string,
      other: string,
    },
    validation: {
      firstName: string,
      lastName: string,
      email: string,
      phone: string,
      subject: string,
      message: string,
      consent: string,
    },
    success: {
      title: string,
      description: string,
      button: string,
    },
    error: {
      title: string,
      description: string,
      retry: string,
    },
    successMessage: {
      title: string,
      description: string,
      button: string,
    },
  }




interface ContactFormProps {
  translations?: ContactFormTranslations;
}

export default function ContactForm({ translations }: ContactFormProps) {
  const { lang } = useParams();
  const { t, isLoaded: i18nLoaded } = useClientTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);



  useEffect(() => {
    // Utiliser directement l'état de chargement du hook useClientTranslation
    if (i18nLoaded && !isLoaded) {
    
      setIsLoaded(true);
    }
  }, [i18nLoaded, isLoaded, lang, t]);

  // Définition du schéma de validation
  const formSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: translations?.validation.firstName as string }),
    lastName: z
      .string()
      .min(2, { message: translations?.validation.lastName as string }),
    email: z
      .string()
      .email({ message: translations?.validation.email as string }),
    phone: z
      .string()
      .min(9, {
        message: translations?.validation.phone as string,
      })
      .optional(),
    subject: z.string({
      required_error: translations?.validation.subject as string,
    }),
    message: z
      .string()
      .min(10, { message: translations?.validation.message as string })
        .max(500, { message: translations?.validation.message as string }),
    consent: z.boolean().refine((val) => val === true, {
      message: translations?.validation.consent as string,
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Remplacer la fonction de simulation par la fonction réelle
  async function submitContactForm(data: FormValues) {
    try {
      const result = await envoyerEmailsContact(
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        data.phone || "",
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      consent: false,
    },
  });

  // Gérer la soumission du formulaire
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        setIsSuccess(true);
        form.reset();
        toast({
          title: translations?.success.title as string,
          description: translations?.success.description as string,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: translations?.error.title as string,
        description: translations?.error.description as string,
        variant: "destructive",
        action: (
          <ToastAction altText={translations?.error.retry as string} onClick={() => onSubmit(data)}>
            {translations?.error.retry as string}
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
        {translations?.title as string}
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
          <h3 className="text-white text-xl font-medium mb-2">
            {translations?.successMessage.title as string}
          </h3>
          <p className="text-gray-400 mb-6">
            {translations?.successMessage.description as string}
          </p>
          <Button onClick={() => setIsSuccess(false)}>
            {translations?.successMessage.button as string}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{translations?.firstName as string}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.placeholders.firstName as string} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">{translations?.lastName as string}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.placeholders.lastName as string} {...field} />
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
                    <FormLabel className="text-white">{translations?.email as string}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.placeholders.email as string} {...field} />
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
                    <FormLabel className="text-white">{translations?.phone as string}</FormLabel>
                    <FormControl>
                      <Input placeholder={translations?.placeholders.phone as string} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">{translations?.subject as string}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={translations?.placeholders.subject as string} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="information">{translations?.subjectOptions.information as string}</SelectItem>
                      <SelectItem value="inscription">{translations?.subjectOptions.registration as string}</SelectItem>
                      <SelectItem value="partenariat">{translations?.subjectOptions.partnership as string}</SelectItem>
                      <SelectItem value="autre">{translations?.subjectOptions.other as string}</SelectItem>
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
                  <FormLabel className="text-white">{translations?.message as string}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translations?.placeholders.message as string}
                      className="min-h-[120px]"
                      {...field}
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-400 font-normal">
                      {translations?.consent as string}{" "}
                      <a href="#" className="text-primary hover:underline">
                        {translations?.privacyPolicy as string}
                      </a>
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
                  {translations?.submitting as string}
                </>
              ) : (
                translations?.submit as string
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
