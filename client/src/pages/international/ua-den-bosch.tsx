// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function UaDenbosch() {
  return (
    <InternationalLanding
      language="ua"
      city="den-bosch"
      translations={internationalTranslations.ua}
    />
  );
}
