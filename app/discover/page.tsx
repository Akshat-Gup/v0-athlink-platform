import { DiscoverClientPage } from "@/app/discover/discover-client-page"
import { getSession } from "@/auth"

export default async function DiscoverPage() {
  const session = await getSession()

  return <DiscoverClientPage session={session} />
}
