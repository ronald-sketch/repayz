// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function EnOisterwijk() {
  return (
    <InternationalLanding
      language="en"
      city="oisterwijk"
      translations={internationalTranslations.en}
    />
  );
}
