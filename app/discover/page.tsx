import { DiscoverClientPage } from "@/app/discover/discover-client-page"
import { auth } from "@/auth"

export default async function DiscoverPage() {
  const session = await auth()
  
  return <DiscoverClientPage session={session} />
}
