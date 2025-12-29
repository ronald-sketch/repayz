interface FAQ {
  question: string;
  answer: string;
}

interface VillageFAQs {
  [key: string]: FAQ[];
}

export const villageFAQs: VillageFAQs = {
  "statiegeld-tilburg": [
    {
      question: "Hoe ver is REPAYZ vanaf Tilburg centrum?",
      answer: "Vanaf Tilburg centrum is het ongeveer 15 minuten rijden (12 km) naar onze bulkautomaat in Oisterwijk. Neem de N65 richting Oisterwijk en je bent er zo. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Hoeveel statiegeld kan ik tegelijk inleveren bij REPAYZ?",
      answer: "Onbeperkt! Onze bulkmachine verwerkt tot 120 items per minuut. Perfect voor horeca, evenementen, of gewoon je hele voorraad van thuis. Veel sneller dan supermarkt automaten (10-30 items/min)."
    },
    {
      question: "Waarom naar REPAYZ in plaats van een supermarkt in Tilburg?",
      answer: "REPAYZ is 4x sneller (120 vs 30 items/min), heeft gratis parkeren direct naast de machine (geen sjouwen!), en je krijgt direct geld via Tikkie. Geen bonnetje, geen wachtrij bij de kassa."
    }
  ],

  "statiegeld-boxtel": [
    {
      question: "Hoe lang duurt het vanaf Boxtel naar REPAYZ?",
      answer: "Vanaf Boxtel is het slechts 10 minuten rijden (8 km) naar onze bulkautomaat in Oisterwijk. Via de N65 ben je er in no-time. Ideaal voor Boxtelse horeca en evenementen!"
    },
    {
      question: "Kan ik grote hoeveelheden statiegeld inleveren?",
      answer: "Ja! Onze bulkmachine is speciaal ontworpen voor grote hoeveelheden. Tot 120 items per minuut - perfect voor horeca, bedrijven met kantines, of evenementen."
    },
    {
      question: "Is er voldoende parkeerplek bij REPAYZ?",
      answer: "Ja, ruime gratis parkeerplaats direct naast de bulkautomaat. Makkelijk uitladen vanuit je auto zonder sjouwen. Geen drukke supermarkt parkeerplaats!"
    }
  ],

  "statiegeld-udenhout": [
    {
      question: "Hoe dichtbij is REPAYZ vanuit Udenhout?",
      answer: "Vanaf Udenhout is het maar 5 minuten rijden (3 km) naar onze bulkautomaat in Oisterwijk - praktisch om de hoek! Ideaal voor Udenhouters die regelmatig statiegeld inleveren."
    },
    {
      question: "Kan ik ook kleine hoeveelheden inleveren?",
      answer: "Ja hoor! Onze bulkautomaat werkt voor elke hoeveelheid - van 10 flessen tot 1000+. Klein of groot, je bent altijd welkom!"
    },
    {
      question: "Moet ik een afspraak maken?",
      answer: "Nee, gewoon langskomen tijdens openingstijden (di-za 10:00-18:00). Geen wachtrij, geen reservering nodig. Onze bulkmachine is supersnel dus je bent zo klaar!"
    }
  ],

  "statiegeld-moergestel": [
    {
      question: "Hoe kom ik vanaf Moergestel bij REPAYZ?",
      answer: "Vanaf Moergestel is het ongeveer 8 minuten rijden (6 km) naar onze bulkautomaat in Oisterwijk. Volg de weg richting Oisterwijk centrum, wij zitten aan de Sprendlingenstraat."
    },
    {
      question: "Hoeveel flessen per minuut verwerkt de bulkmachine?",
      answer: "Onze bulkautomaat verwerkt tot 120 items per minuut! Dat betekent dat je in 10 minuten 1200 flessen/blikjes kwijt bent. Supermarkt automaten doen er 40-120 minuten over voor dezelfde hoeveelheid."
    },
    {
      question: "Is REPAYZ geschikt voor horeca?",
      answer: "Absoluut! Veel horecagelegenheden kiezen voor onze bulkmachine omdat het veel sneller gaat dan supermarkt automaten. 120 items/min betekent dat je in 10 minuten 1200 flessen/blikjes kwijt bent!"
    }
  ],

  "statiegeld-biezenmortel": [
    {
      question: "Hoe ver is REPAYZ vanaf Biezenmortel?",
      answer: "Vanaf Biezenmortel is het ongeveer 7 minuten rijden (5 km) naar onze bulkautomaat in Oisterwijk. Via de Boscheweg ben je er zo. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Wat is het verschil tussen REPAYZ en een supermarkt automaat?",
      answer: "REPAYZ verwerkt 120 items/min (4x sneller), heeft geen wachtrij, gratis parkeren direct naast de machine, en je krijgt direct geld via Tikkie. Supermarkten: 10-30 items/min, vaak lange rijen, ver lopen met zware tassen."
    },
    {
      question: "Krijg ik direct mijn geld?",
      answer: "Ja! Direct na het inleveren krijg je een Tikkie op je telefoon. Binnen enkele seconden staat het geld op je rekening. Geen bonnetje, geen wachten bij de kassa."
    }
  ],

  "statiegeld-berkel-enschot": [
    {
      question: "Hoe lang rijden vanaf Berkel-Enschot naar REPAYZ?",
      answer: "Vanaf Berkel-Enschot is het ongeveer 12 minuten rijden (9 km) naar onze bulkautomaat in Oisterwijk. Via de N65 ben je er snel. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Kan ik mijn hele voorraad statiegeld in één keer inleveren?",
      answer: "Ja! Onze bulkmachine is gemaakt voor grote hoeveelheden. 120 items per minuut betekent dat je 500 flessen in ongeveer 5 minuten kwijt bent. Geen limiet aan het aantal!"
    },
    {
      question: "Welke flessen en blikjes accepteert REPAYZ?",
      answer: "Alle Nederlandse PET flessen en aluminium blikjes met het officiële statiegeld logo. Dit zijn alle flessen en blikjes die je bij elke Nederlandse supermarkt koopt. Geen glas!"
    }
  ],

  "statiegeld-haaren": [
    {
      question: "Hoe ver is het vanaf Haaren naar REPAYZ?",
      answer: "Vanaf Haaren is het ongeveer 10 minuten rijden (7 km) naar onze bulkautomaat in Oisterwijk. Via de N65 richting Oisterwijk ben je er zo. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Is er een limiet aan het aantal flessen dat ik kan inleveren?",
      answer: "Nee! Onze bulkautomaat heeft geen limiet. Of je nu 50 flessen hebt of 5000, onze bulkmachine verwerkt alles. Met 120 items per minuut ben je snel klaar."
    },
    {
      question: "Zijn de openingstijden ook in het weekend?",
      answer: "Ja, we zijn open op zaterdag van 10:00-18:00. Zondag en maandag zijn we gesloten. Dinsdag t/m zaterdag: 10:00-18:00."
    }
  ],

  "statiegeld-helvoirt": [
    {
      question: "Hoe kom ik vanaf Helvoirt bij REPAYZ?",
      answer: "Vanaf Helvoirt is het ongeveer 15 minuten rijden (11 km) naar onze bulkautomaat in Oisterwijk. Via de N65 richting Tilburg, afslag Oisterwijk. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Hoelang duurt het om 500 flessen in te leveren?",
      answer: "Bij REPAYZ: ongeveer 5 minuten! Onze bulkmachine verwerkt 120 items per minuut. Bij een supermarkt automaat (30 items/min) zou dit 15-20 minuten duren, plus wachttijd in de rij."
    },
    {
      question: "Kan ik betalen met bonnetje of alleen Tikkie?",
      answer: "We werken met direct Tikkie betaling - geen bonnetjes! Je ontvangt direct na het inleveren een Tikkie op je telefoon. Binnen enkele seconden staat het geld op je rekening. Simpel en snel!"
    }
  ],

  "statiegeld-loon-op-zand": [
    {
      question: "Hoe ver is REPAYZ vanaf Loon op Zand?",
      answer: "Vanaf Loon op Zand is het ongeveer 20 minuten rijden (15 km) naar onze bulkautomaat in Oisterwijk. Via de N261 en N65 ben je er zo. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Is de bulkautomaat geschikt voor grote hoeveelheden?",
      answer: "Ja! Dat is precies waarvoor onze bulkmachine is ontworpen. 120 items per minuut betekent dat je 1000 flessen in ongeveer 10 minuten kwijt bent. Perfect voor horeca, evenementen, of grote voorraden."
    },
    {
      question: "Is er vaak een wachtrij bij REPAYZ?",
      answer: "Nee! In tegenstelling tot supermarkten hebben we zelden wachtrijen. Onze bulkmachine is zo snel (120 items/min) dat mensen snel klaar zijn. Meestal kun je direct aan de slag."
    }
  ],

  "statiegeld-hilvarenbeek": [
    {
      question: "Hoe lang rijden vanaf Hilvarenbeek naar REPAYZ?",
      answer: "Vanaf Hilvarenbeek is het ongeveer 18 minuten rijden (13 km) naar onze bulkautomaat in Oisterwijk. Via de N269 en N65 ben je er snel. Gratis parkeren direct naast de machine!"
    },
    {
      question: "Kan ik als horeca mijn statiegeld bij REPAYZ inleveren?",
      answer: "Ja! Veel horecagelegenheden uit de regio kiezen voor REPAYZ vanwege de snelheid. 120 items/min betekent dat je grote voorraden snel kwijt bent. Geen gedoe met supermarkt automaten die veel trager zijn."
    },
    {
      question: "Accepteert REPAYZ bulk statiegeld van evenementen?",
      answer: "Absoluut! Onze bulkautomaat is perfect voor evenementen organisatoren. Grote hoeveelheden flessen en blikjes? Geen probleem! 120 items per minuut, gratis parkeren, en direct betaling via Tikkie."
    }
  ]
};
