// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function BgOisterwijk() {
  return (
    <InternationalLanding
      language="bg"
      city="oisterwijk"
      translations={internationalTranslations.bg}
    />
  );
}
