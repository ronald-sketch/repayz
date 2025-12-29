// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function LoonOpZand() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-loon-op-zand");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
