// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function EnTilburg() {
  return (
    <InternationalLanding
      language="en"
      city="tilburg"
      translations={internationalTranslations.en}
    />
  );
}
