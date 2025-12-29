// @ts-nocheck
import VillageLanding from "../VillageLanding";
import { villages } from "../../data/villages";
import { villageFAQs } from "../../data/villageFAQs";

export default function Tilburg() {
  const villageData = villages.find(v => v.slug === "statiegeld-tilburg")!;
  const faqs = villageFAQs["statiegeld-tilburg"];
  return <VillageLanding village={villageData} faqs={faqs} />;
}
