// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function RoTilburg() {
  return (
    <InternationalLanding
      language="ro"
      city="tilburg"
      translations={internationalTranslations.ro}
    />
  );
}
