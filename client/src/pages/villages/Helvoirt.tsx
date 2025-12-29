// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Helvoirt() {
  const villageData = villages.find(v => v.slug === "statiegeld-helvoirt")!;
  const faqs = villageFAQs["statiegeld-helvoirt"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
