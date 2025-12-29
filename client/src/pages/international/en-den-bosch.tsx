// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function EnDenbosch() {
  return (
    <InternationalLanding
      language="en"
      city="den-bosch"
      translations={internationalTranslations.en}
    />
  );
}
