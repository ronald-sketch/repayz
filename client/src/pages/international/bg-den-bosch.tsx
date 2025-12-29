// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function BgDenbosch() {
  return (
    <InternationalLanding
      language="bg"
      city="den-bosch"
      translations={internationalTranslations.bg}
    />
  );
}
