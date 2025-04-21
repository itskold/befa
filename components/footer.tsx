import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer({ 
  activities,
  dictionary 
}: { 
  activities: any[];
  dictionary: Record<string, any>;
}) {
  const t = (key: string): string => {
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
      }, obj);
    };
    
    return getNestedValue(dictionary, key) || key;
  };

  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-12 w-auto">
                <Image
                  src="/images/befa-logo.png"
                  alt="BEFA Logo"
                  width={80}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-white font-bold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t("header.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/activites"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t("header.activities")}
                </Link>
              </li>

              <li>
                <Link
                  href="/galerie"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t("header.gallery")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsoring"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t("header.sponsoring")}
                </Link>
              </li>
            </ul>
          </div>

          {/* activités */}
          <div>
            <h3 className="text-white text-white font-bold mb-4">Activités</h3>
            <ul className="space-y-2">
              {activities
                .slice(0, 4)
                .reverse()
                .map((activity) => (
                  <li key={activity.id}>
                    <Link
                      href={
                        activity.link
                          ? activity.link
                          : `/activites/${activity.id}`
                      }
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {activity[t("footer.titleLang")]}
                    </Link>
                  </li>
                ))}
              
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="text-white text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">
                  KSC Grimbergen
                  <br />
                  Brusselsesteenweg 170
                  <br />
                  1850 Grimbergen
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <Link
                  href="tel:+32473999170"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  +32 473 99 91 70
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <Link
                  href="mailto:info@befa-academy.be"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  info@befa-academy.be
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Partenariat avec KSC Grimbergen */}
        <div className="flex flex-col items-center justify-center mb-8 border-t border-gray-700 pt-8">
          <p className="text-white font-medium text-center mb-4">
            {t("footer.partnership")}
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="relative h-16 w-16">
              <Image
                src="/images/belgium-flag-logo.png"
                alt="BEFA Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="relative h-20 w-20">
              <Link href="https://www.kscg.be/" target="_blank">
                <Image
                  src="/images/ksc-grimbergen-logo.png"
                  alt="KSC Grimbergen Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BEFA Academy. {t("footer.copyright")}
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.privacyPolicy")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.termsOfUse")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("footer.cookies")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
