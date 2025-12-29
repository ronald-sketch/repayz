// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Boxtel() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-boxtel");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
