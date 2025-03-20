import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Projectrix',
  description: 'Our privacy policy details how Projectrix collects, uses, and protects your personal information when using our platform.',
  openGraph: {
    title: 'Privacy Policy | Projectrix',
    description: 'Learn how we protect your data and privacy on the Projectrix platform.',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}