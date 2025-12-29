// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function PlBoxtel() {
  return (
    <InternationalLanding
      language="pl"
      city="boxtel"
      translations={internationalTranslations.pl}
    />
  );
}
