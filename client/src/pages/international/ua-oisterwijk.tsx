// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function UaOisterwijk() {
  return (
    <InternationalLanding
      language="ua"
      city="oisterwijk"
      translations={internationalTranslations.ua}
    />
  );
}
