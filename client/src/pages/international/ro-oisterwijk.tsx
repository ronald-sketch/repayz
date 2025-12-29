// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function RoOisterwijk() {
  return (
    <InternationalLanding
      language="ro"
      city="oisterwijk"
      translations={internationalTranslations.ro}
    />
  );
}
