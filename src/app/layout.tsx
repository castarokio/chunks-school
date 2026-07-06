import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Chunks School | منصة تعليمية متقدمة",
  description:
    "منصة تعليمية متقدمة تجمع بين التكنولوجيا الحديثة وأساليب التعلم المبتكرة. An advanced educational platform combining modern technology and innovative learning methods. Plateforme éducative avancée combinant technologie moderne et méthodes d'apprentissage innovantes.",
  keywords: [
    "Chunks School",
    "تشانكس سكول",
    "تعليم",
    "education",
    "الجزائر",
    "Algeria",
    "لغات",
    "languages",
    "دورات",
    "courses",
    "تعلم الكتروني",
    "e-learning",
  ],
  authors: [{ name: "Chunks School" }],
  icons: {
    icon: "/champs-logo.png",
  },
  openGraph: {
    title: "Chunks School - منصة تعليمية متقدمة",
    description:
      "منصة تعليمية متقدمة تجمع بين التكنولوجيا الحديثة وأساليب التعلم المبتكرة",
    type: "website",
    locale: "ar_DZ",
    alternateLocale: ["en_US", "fr_DZ"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        className="bg-background font-sans text-foreground antialiased"
      >
        {children}
        <Toaster richColors position="top-center" dir="auto" />
      </body>
    </html>
  );
}
