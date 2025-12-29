// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function PlTilburg() {
  return (
    <InternationalLanding
      language="pl"
      city="tilburg"
      translations={internationalTranslations.pl}
    />
  );
}
