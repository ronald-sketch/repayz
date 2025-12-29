// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Haaren() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-haaren");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
