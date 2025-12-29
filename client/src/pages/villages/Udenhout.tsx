// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Udenhout() {
  const villageData = villages.find(v => v.slug === "statiegeld-udenhout")!;
  const faqs = villageFAQs["statiegeld-udenhout"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
