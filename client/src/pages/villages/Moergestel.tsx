// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Moergestel() {
  const villageData = villages.find(v => v.slug === "statiegeld-moergestel")!;
  const faqs = villageFAQs["statiegeld-moergestel"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
