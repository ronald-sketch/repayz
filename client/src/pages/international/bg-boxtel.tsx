// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function BgBoxtel() {
  return (
    <InternationalLanding
      language="bg"
      city="boxtel"
      translations={internationalTranslations.bg}
    />
  );
}
