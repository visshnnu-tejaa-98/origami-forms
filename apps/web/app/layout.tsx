import type { Metadata } from "next";
import "./globals.css";
import "./origami.css";
import { GlobalProviders } from "~/providers/global";

export const metadata: Metadata = {
  title: "Origami · forms that feel handmade",
  description:
    "Origami is a Typeform-style form builder designed like a Japanese stationery set. Fold a beautiful form in two minutes, publish a private link, and watch the responses fall onto your paper desk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-palette="coral"
      data-heading-font="caveat"
      data-texture="med"
      data-rotation="gentle"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="o-scope">
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
