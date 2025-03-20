import { Metadata } from 'next';

// Note: For dynamic routes, we use a default metadata as fallback
// The actual metadata will be generated in page.tsx
export const metadata: Metadata = {
  title: 'Project Details',
  description: 'View detailed information about this collaborative development project including technologies, roles, and features.',
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}