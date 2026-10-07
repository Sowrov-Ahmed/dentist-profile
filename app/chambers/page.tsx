import { ChambersPage } from "@/features/chambers/ChambersPage";
import { getChambers, getPrimaryChamber } from "@/features/chambers/chambers.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Chambers",
  description: "View dental specialist consultation chambers with locations, visiting schedules, direct contact numbers, consultation fees, and map links.",
  path: "/chambers"
});

export default async function ChambersRoutePage() {
  const chambers = await getChambers();
  const primaryChamber = getPrimaryChamber(chambers);

  return <ChambersPage chambers={chambers} primaryChamber={primaryChamber} />;
}
