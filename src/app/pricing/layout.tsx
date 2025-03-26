import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans - Free & Pro Subscription Options',
  description: 'Explore Projectrix subscription plans. Start with our free tier or upgrade to Pro for unlimited projects, collaborations, and advanced features.',
  openGraph: {
    title: 'Projectrix Pricing | Free & Pro Plans',
    description: 'Choose the perfect plan for your development journey. Start for free and upgrade as you grow.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Projectrix Pricing Plans',
      }
    ],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}