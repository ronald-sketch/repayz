// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function PlOisterwijk() {
  return (
    <InternationalLanding
      language="pl"
      city="oisterwijk"
      translations={internationalTranslations.pl}
    />
  );
}
