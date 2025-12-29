// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function BerkelEnschot() {
  const villageData = villages.find(v => v.slug === "statiegeld-berkel-enschot")!;
  const faqs = villageFAQs["statiegeld-berkel-enschot"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
