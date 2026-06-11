import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { SITE_URL, getLocalBusinessSchema } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Container único do GTM. <<CONFIRMAR GTM-XXXXXXX>>
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TOCSOLAR Energia Solar — Energia solar que realmente economiza",
    template: "%s | TOCSOLAR Energia Solar",
  },
  description:
    "Energia solar para residências e empresas em Fortaleza/CE. Do orçamento à instalação, com economia real na conta de luz. Peça seu orçamento.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TOCSOLAR Energia Solar",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "TOCSOLAR Energia Solar",
    description:
      "Energia solar para residências e empresas em Fortaleza/CE. Economia real na conta de luz.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          // JSON-LD LocalBusiness — SEO local (Fortaleza/CE).
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLocalBusinessSchema()),
          }}
        />
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-brand-black antialiased">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        )}
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
