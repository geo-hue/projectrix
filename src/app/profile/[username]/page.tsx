// src/app/profile/[username]/page.tsx
import PublicProfilePage from "@/components/PublicProfilePage";

export default function Page({ params }: { params: { username: string } }) {
  // Convert the params to a string to avoid serialization issues
  // when passing from Server Component to Client Component
  return <PublicProfilePage params={params} />;
}