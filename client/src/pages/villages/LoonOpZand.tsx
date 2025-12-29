// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function LoonOpZand() {
  const villageData = villages.find(v => v.slug === "statiegeld-loon-op-zand")!;
  const faqs = villageFAQs["statiegeld-loon-op-zand"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
