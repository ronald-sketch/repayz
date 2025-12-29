// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Helvoirt() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-helvoirt");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
