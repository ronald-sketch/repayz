// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function UaTilburg() {
  return (
    <InternationalLanding
      language="ua"
      city="tilburg"
      translations={internationalTranslations.ua}
    />
  );
}
