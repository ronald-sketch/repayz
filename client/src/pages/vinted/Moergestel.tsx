// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Moergestel() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-moergestel");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
