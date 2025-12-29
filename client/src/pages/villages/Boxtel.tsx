// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Boxtel() {
  const villageData = villages.find(v => v.slug === "statiegeld-boxtel")!;
  const faqs = villageFAQs["statiegeld-boxtel"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
