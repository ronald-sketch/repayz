// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function UaBoxtel() {
  return (
    <InternationalLanding
      language="ua"
      city="boxtel"
      translations={internationalTranslations.ua}
    />
  );
}
