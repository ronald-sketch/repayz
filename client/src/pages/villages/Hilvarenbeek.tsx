// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Hilvarenbeek() {
  const villageData = villages.find(v => v.slug === "statiegeld-hilvarenbeek")!;
  const faqs = villageFAQs["statiegeld-hilvarenbeek"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
