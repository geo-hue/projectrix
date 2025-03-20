import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Custom Software Project Ideas',
  description: 'Create personalized software project ideas based on your technology stack, preferences, and skills. AI-powered project generation to help you build your portfolio.',
  openGraph: {
    title: 'Generate Project Ideas with AI | Projectrix',
    description: 'Customize your next project based on preferred technologies, complexity level, and team size.',
    images: [
      {
        url: '/og-generate.png',
        width: 1200,
        height: 630,
        alt: 'Generate Project Ideas - Projectrix',
      }
    ],
  },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}