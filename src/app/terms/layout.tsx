import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Projectrix',
  description: 'Read our terms of service agreement for using the Projectrix platform, including user responsibilities and platform policies.',
  openGraph: {
    title: 'Terms of Service | Projectrix',
    description: 'Learn about the terms governing your use of the Projectrix platform.',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

