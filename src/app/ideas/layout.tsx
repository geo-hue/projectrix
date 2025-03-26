import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Available Software Development Projects',
  description: 'Discover collaborative software development projects. Filter by technology, complexity, and role to find the perfect project to join and contribute to.',
  openGraph: {
    title: 'Browse Available Projects | Projectrix',
    description: 'Find projects to collaborate on, filtered by your preferred technologies and skills.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Browse Projects - Projectrix',
      }
    ],
  },
};

export default function IdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}