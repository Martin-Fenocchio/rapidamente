import type { Metadata } from "next";
import Script from "next/script";
import Providers from "./providers";
import "src/assets/style/global.scss";
import "@fontsource/geist-sans/400.css";
import "animate.css";
import "transition-style";
import "react-responsive-modal/styles.css";

export const metadata: Metadata = {
  title: "RápidaMente",
  description: "Entrena tu mente y compite con otros en simples pero rápidas cuentas matemáticas.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/isotype.svg` },
  openGraph: { title: "RápidaMente", description: "Entrena tu mente con rápidas cuentas matemáticas." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
        {analyticsId && <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(analyticsId)});
          `}</Script>
        </>}
      </body>
    </html>
  );
}
