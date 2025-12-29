// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function RoDenbosch() {
  return (
    <InternationalLanding
      language="ro"
      city="den-bosch"
      translations={internationalTranslations.ro}
    />
  );
}
