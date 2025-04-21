import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function InscriptionLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-foreground">
      {/* Hero Section Skeleton */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,243,1,0.1),transparent_60%)]"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-6 w-40 bg-secondary/60 mx-auto mb-4" />
            <Skeleton className="h-12 md:h-14 w-full max-w-xl mx-auto mb-4 bg-secondary/60" />
            <Skeleton className="h-6 w-full max-w-md mx-auto mb-6 bg-secondary/60" />

            {/* Indicateur de progression */}
            <div className="flex items-center justify-center mt-6 mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-secondary">
                  1
                </div>
                <div className="h-1 w-12 bg-secondary/50"></div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/50 text-gray-400">
                  2
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-32 mx-auto bg-secondary/60" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground to-transparent"></div>
      </section>

      {/* Formulaire Skeleton */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-secondary border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-primary/50 border-b border-gray-700 pb-4">
                <Skeleton className="h-8 w-64 bg-primary/40" />
                <Skeleton className="h-4 w-full max-w-md mt-2 bg-primary/40" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Activité */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-primary font-medium">1</span>
                      </div>
                      <Skeleton className="h-6 w-48 bg-primary/40" />
                    </div>

                    <Skeleton className="h-20 w-full rounded-lg bg-primary/40" />

                    <div className="space-y-4">
                      <Skeleton className="h-4 w-32 bg-primary/40" />
                      <Skeleton className="h-10 w-full bg-primary/40" />
                    </div>

                    <div className="space-y-4">
                      <Skeleton className="h-4 w-32 bg-primary/40" />
                      <Skeleton className="h-10 w-full bg-primary/40" />
                    </div>
                  </div>

                  {/* Joueur */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-primary font-medium">2</span>
                      </div>
                      <Skeleton className="h-6 w-48 bg-primary/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-primary/40" />
                        <Skeleton className="h-10 w-full bg-primary/40" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-primary/40" />
                        <Skeleton className="h-10 w-full bg-primary/40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40 bg-primary/40" />
                        <Skeleton className="h-10 w-full bg-primary/40" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-primary/40" />
                        <Skeleton className="h-10 w-full bg-primary/40" />
                      </div>
                    </div>
                  </div>

                  {/* Parent */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-primary font-medium">3</span>
                      </div>
                      <Skeleton className="h-6 w-64 bg-primary/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-primary/40" />
                          <Skeleton className="h-10 w-full bg-primary/40" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-primary font-medium">4</span>
                      </div>
                      <Skeleton className="h-6 w-32 bg-primary/40" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40 bg-primary/40" />
                      <Skeleton className="h-10 w-full bg-primary/40" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-primary/40" />
                        <Skeleton className="h-10 w-full bg-primary/40" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-primary/40" />
                        <Skeleton className="h-10 w-full bg-primary/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 bg-primary/50 border-t border-gray-700">
                <div className="flex w-full justify-end">
                  <Skeleton className="h-10 w-48 bg-primary/30" />
                </div>
              </CardFooter>
            </Card>

            {/* Informations supplémentaires */}
            <div className="mt-8 bg-primary/30 rounded-xl p-6">
              <Skeleton className="h-6 w-40 mb-4 bg-secondary/40" />
              <Skeleton className="h-4 w-full max-w-lg mb-4 bg-secondary/40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-xs bg-secondary/40" />
                <Skeleton className="h-4 w-full max-w-sm bg-secondary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
