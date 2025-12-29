// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function EnBoxtel() {
  return (
    <InternationalLanding
      language="en"
      city="boxtel"
      translations={internationalTranslations.en}
    />
  );
}
