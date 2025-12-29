// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Oisterwijk() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-oisterwijk");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
