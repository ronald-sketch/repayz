// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Haaren() {
  const villageData = villages.find(v => v.slug === "statiegeld-haaren")!;
  const faqs = villageFAQs["statiegeld-haaren"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
