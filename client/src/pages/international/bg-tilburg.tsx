// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function BgTilburg() {
  return (
    <InternationalLanding
      language="bg"
      city="tilburg"
      translations={internationalTranslations.bg}
    />
  );
}
