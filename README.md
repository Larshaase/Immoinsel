# ImmoInsel – Website

Statische Website (HTML / CSS / JavaScript) für den Immobilienmakler **ImmoInsel**.
Elegantes, wertiges Design (Anthrazit + Champagner-Gold) – ohne Build-Tools,
einfach hochladen und fertig.

## Struktur

```
Immoinsel/
├── index.html         # Komplette One-Page-Website (alle Bereiche)
├── impressum.html     # Impressum (Vorlage, § 34c GewO)
├── datenschutz.html   # Datenschutzerklärung (Vorlage)
├── css/style.css      # Gestaltung
├── js/main.js         # Menü, Objektart-Auswahl, Merken-Funktion
├── img/               # Bilder + Favicon (hier eigene Fotos ablegen)
├── robots.txt
├── sitemap.xml
└── upload.ps1         # SFTP-Upload zum Hoster
```

## Bereiche der Seite

- **Hero** – „Verkaufen Sie dort, wo Ihre Immobilie zuhause ist." + Sterne-Bewertung
- **Wertermittlung** – schwebende Karte als zentraler Lead-Magnet (Objektart wählbar)
- **Trust-Band** – Verkaufsdauer, Google-Bewertung, erzielter Preis, vermittelte Objekte
- **Angebote** – Objekt-Karten inkl. gesetzlich pflichtiger Energieangaben
- **Ablauf** – Verkauf in vier Schritten
- **Testimonial** – Kundenstimme
- **Team** – Ansprechpartner mit Telefonnummern
- **CTA + Footer** – Abschluss-Aufruf, Impressum / Datenschutz

## Lokal ansehen

Einfach `index.html` im Browser öffnen. Oder ein kleiner lokaler Server:

```bash
python -m http.server 8000   # danach: http://localhost:8000
```

## Design

- **Farben:** Anthrazit `#15171C`, Champagner-Gold `#C9A86A`, Platin `#E9EBEE`,
  warmer Creme-Ton `#F5F2EB` für helle Sektionen.
- **Typografie:** Cormorant Garamond (Headlines), Manrope (Fließtext) via Google Fonts.
- **Signature:** das Herz aus der Wortmarke als wiederkehrendes Trennelement.
- Die Wortmarke „IMMO ♥ INSEL" ist in CSS nachgebaut (kein Bild nötig).

## Noch anzupassen (Beispieldaten → echte Daten)

Die Seite ist mit **Beispieldaten** befüllt. Vor dem Livegang bitte ersetzen:

- **Kontakt/Adresse/Telefon/E-Mail** in `index.html`, `impressum.html`, `datenschutz.html`
- **Impressum:** Rechtsform, Inhaber/Geschäftsführer, Register, USt-IdNr.,
  **Erlaubnis nach § 34c GewO** + Aufsichtsbehörde, Berufshaftpflicht
- **Objekte & Team:** echte Fotos in `img/` ablegen und die Pfade/Texte anpassen
  (`img/objekt-1.jpg` … `img/team-1.jpg`, `img/hero.jpg`, `img/cta.jpg`, `img/og-image.jpg`)
- **Kennzahlen & Bewertung** durch echte Werte ersetzen
- **Domain** (`www.immoinsel.de`) in `index.html`, `robots.txt`, `sitemap.xml` prüfen

## Bilder

Aktuell verweisen die Bildpfade auf noch abzulegende Dateien in `img/`
(Hero, CTA, 3 Objekte, 3 Team-Fotos, OG-Bild). Bis dahin bleiben die Flächen
im Marken-Anthrazit. Eigene Fotos einfach unter gleichem Namen ablegen.

## Wertermittlung / Kontakt

Die Wertermittlungs-Karte ist aktuell ein optischer Lead-Magnet; die Buttons
öffnen das E-Mail-Programm (`mailto:`). Für echten Versand ohne eigenes Backend
eignet sich ein Formular-Dienst wie **Web3Forms** oder **Formspree** – dann ein
echtes Formular einbauen und den Access-Key hinterlegen (siehe andere Projekte).

## Veröffentlichen

Den Ordnerinhalt auf einen beliebigen Webspace laden – per `upload.ps1` (SFTP,
Zugangsdaten oben eintragen) oder kostenlos per GitHub Pages / Netlify / Vercel.
