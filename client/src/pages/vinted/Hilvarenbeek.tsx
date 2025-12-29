// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Hilvarenbeek() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-hilvarenbeek");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
