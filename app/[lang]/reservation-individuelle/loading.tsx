import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h2 className="text-white mt-4 text-xl font-semibold">Chargement...</h2>
      <p className="text-gray-500">
        Préparation de votre formulaire de réservation
      </p>
    </div>
  );
}
