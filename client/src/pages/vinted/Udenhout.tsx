// @ts-nocheck
import VintedVillageLanding from "../VintedVillageLanding";
import { vintedVillages } from "@/data/vintedVillages";

export default function Udenhout() {
  const village = vintedVillages.find(v => v.slug === "vinted-locker-udenhout");
  if (!village) return null;
  return <VintedVillageLanding village={village} />;
}
