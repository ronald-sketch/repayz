// @ts-nocheck
import InternationalLanding from "../InternationalLanding";
import { internationalTranslations } from "@/data/internationalTranslations";

export default function RoBoxtel() {
  return (
    <InternationalLanding
      language="ro"
      city="boxtel"
      translations={internationalTranslations.ro}
    />
  );
}
