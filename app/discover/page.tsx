import { DiscoverClientPage } from "@/app/discover/discover-client-page"

export default async function DiscoverPage() {
  // Session is handled client-side by AuthProvider
  return <DiscoverClientPage session={null} />
}
