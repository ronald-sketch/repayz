// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function BerkelEnschot() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-berkel-enschot");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
