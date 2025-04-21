"use client";

import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { HelpInfo } from "@/components/payment/HelpInfo";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";

export default async function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation_id");

  if (reservationId) {
    const reservationRef = doc(db, "reservations", reservationId);
    const reservationSnap = await getDoc(reservationRef);

    if (reservationSnap.exists()) {
      await updateDoc(reservationRef, {
        "payment.status": "completed",
        updatedAt: Timestamp.now(),
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
              Erreur <span className="text-primary">de paiement</span>
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Formulaire d'inscription */}
      <section className="py-8 md:py-12">
        <div className="w-full max-w-md p-6 bg-secondary rounded-xl shadow-lg">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-white text-2xl font-bold text-white mb-4">
              Paiement annulé
            </h2>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-2">
                <Image
                  src="/images/befa-logo.png"
                  alt="BEFA Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <p className="text-gray-300 mb-4">
                Votre paiement a été annulé. Votre inscription est toujours en
                attente. Vous pouvez réessayer le paiement ou choisir une autre
                méthode de paiement.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                asChild
                className="bg-primary text-secondary hover:bg-primary/90 w-full"
              >
                <Link href={`/inscription?reservation_id=${reservationId}`}>
                  Réessayer le paiement
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-secondary/80 w-full"
              >
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </div>
        <HelpInfo />
      </section>
    </div>
  );
}
