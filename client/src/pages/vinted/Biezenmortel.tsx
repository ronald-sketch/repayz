// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Biezenmortel() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-biezenmortel");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
