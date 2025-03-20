import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Projectrix - Your Gateway to Collaborative Development',
  description: 'Learn about Projectrix - the platform connecting developers with meaningful projects and collaborators to enhance your portfolio through collaborative work.',
  openGraph: {
    title: 'About Projectrix | Collaborative Development Platform',
    description: 'Discover how Projectrix is transforming the way developers collaborate and build their portfolios.',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Projectrix - Collaborative Development Platform',
      }
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}