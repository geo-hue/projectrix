import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Your Project Collaborations',
  description: 'Track and manage all your project collaborations, requests, and active projects in one place. See your collaboration history and upcoming opportunities.',
  openGraph: {
    title: 'My Collaborations | Projectrix',
    description: 'Manage your development project collaborations and team activities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Projectrix Collaborations Dashboard',
      }
    ],
  },
};

export default function CollaborationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}