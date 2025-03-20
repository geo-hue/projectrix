import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Feedback - Help Improve Projectrix',
  description: 'Share your thoughts, report bugs, or suggest new features to help us improve Projectrix for the entire developer community.',
  openGraph: {
    title: 'Community Feedback | Projectrix',
    description: 'Join the community in shaping the future of Projectrix through your valuable feedback.',
    images: [
      {
        url: '/og-feedback.png',
        width: 1200,
        height: 630,
        alt: 'Projectrix Community Feedback',
      }
    ],
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}