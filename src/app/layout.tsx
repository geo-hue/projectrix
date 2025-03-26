import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Black_Ops_One, Orbitron, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/PageTransition";
import { Providers } from "./providers/provider";
import { Toaster } from "sonner";
import AuthWrapper from "./hooks/AuthWrapper";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' }
  ]
};
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-ops",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Projectrix - Collaborative Development Platform',
    default: 'Projectrix - Transform Ideas into Collaborative Development Projects',
  },
  description: "Projectrix connects developers with meaningful projects and collaborators, making it easier to build your portfolio while working with others.",
  keywords: ["project ideas", "developer collaboration", "coding projects", "portfolio builder", "tech collaboration", "software development", "project generation"],
  metadataBase: new URL('https://www.projectrix.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-us',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.projectrix.app',
    siteName: 'Projectrix',
    title: 'Projectrix - Transform Ideas into Collaborative Development Projects',
    description: 'Connect with developers, generate project ideas, and build your portfolio through meaningful collaboration.',
    images: [
      {
        url: 'https://www.projectrix.app/og-image.png', // Create this image file (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Projectrix - Collaborative Development Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projectrix - Transform Ideas into Collaborative Development Projects',
    description: 'Connect with developers, generate project ideas, and build your portfolio through meaningful collaboration.',
    images: ['https://www.projectrix.app/og-image.png'],
    creator: '@projectrix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${blackOpsOne.variable} ${orbitron.variable} ${pressStart2P.variable} antialiased`}
      >
        <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
            <Toaster 
  richColors 
  position="top-center"
  closeButton
  theme="system"
/>
              <AuthWrapper>
              <PageTransition>{children}</PageTransition>
              </AuthWrapper>
            </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}