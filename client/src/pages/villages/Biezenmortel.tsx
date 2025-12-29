// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Biezenmortel() {
  const villageData = villages.find(v => v.slug === "statiegeld-biezenmortel")!;
  const faqs = villageFAQs["statiegeld-biezenmortel"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
