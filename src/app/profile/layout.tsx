import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Developer Profile & Projects',
  description: 'Manage your developer profile, view your projects, and track your activity on Projectrix. Your collaboration and development hub.',
  openGraph: {
    title: 'Developer Profile | Projectrix',
    description: 'Your personalized dashboard for managing projects and collaborations.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Projectrix Developer Profile',
      }
    ],
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}