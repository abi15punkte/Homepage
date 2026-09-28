# Prompt: Inhalte der alten Homepage 1:1 in die neue Version übertragen

Du bekommst zwei Dinge:
1. Die alte Version der Schulhomepage, erreichbar unter https://a2s5t2r6id.github.io/ (Startseite, Aktuelles, Unsere Schule, Termine, Kontakt, Impressum sowie die Unterseiten von "Unsere Schule").
2. Die neue Version als Single-Page-App (`landingpage.html`) mit Hero-Slider, Teaser-Karten und Overlays (`newsOverlay`, `schoolOverlay`, `datesOverlay`, `contactOverlay`, `supportOverlay`).

Aufgabe: Übertrage die **echten Inhalte** der alten Seite 1:1 in die entsprechenden Bereiche der neuen Seite, ohne das bestehende Design, Layout, die Overlay-Struktur oder die Interaktionslogik (Hero-Slider, Swipe-Teaser, Routing über Hashes) zu verändern.

## 1. Navigations-/Seitenstruktur abgleichen
Alte Seite hat 5 Hauptseiten: Aktuelles, Unsere Schule, Termine, Kontakt, Impressum.
Neue Seite hat 5 Teaser/Overlays: Neuigkeiten (`newsOverlay`), Unsere Schule (`schoolOverlay`), Termine (`datesOverlay`), Kontakt (`contactOverlay`), Technischer Support (`supportOverlay`).
- [ ] "Technischer Support" (`supportOverlay`) bleibt ein eigener, separater Bereich.
- [ ] Die Inhalte aus dem alten Kontaktbereich, die inhaltlich zu "Technischer Support" passen (insbesondere der IServ-Bereich, siehe Aufgabe 3), werden dorthin übertragen; alles andere aus dem alten Kontaktbereich bleibt im `contactOverlay` (siehe Aufgabe 3).
- [ ] Impressum wird in diesem Durchgang **nicht** angelegt – bleibt vorerst ausgelassen.

## 2. Unsere Schule
Die alte "Unsere Schule"-Übersichtsseite verlinkt auf acht Unterseiten:
Leitbild, Maria-Montessori-Pädagogik, Unsere Klassen, Unser Team, Unsere Projekte, Erziehungsvereinbarung, Unser Förderverein, Offener Ganztag.
Die neue Seite bietet im `schoolOverlay` aktuell drei Kacheln: "Unser Leitbild", "Unser Kollegium", "Schulprofil & AGs".
- [ ] Inhalte der Unterseiten **Leitbild**, **Unser Team** und **Unsere Projekte/AGs** aus der alten Seite abrufen und in die drei bestehenden Kacheln übertragen (aktuell stehen dort nur Platzhaltertexte).
- [ ] Die übrigen alten Unterseiten (Maria-Montessori-Pädagogik, Unsere Klassen, Erziehungsvereinbarung, Förderverein, Offener Ganztag) werden **inklusive Inhalt vollständig übernommen** – dafür weitere Kacheln/Artikel-Overlays nach demselben Muster (`createArticleOverlay`) ergänzen, sodass am Ende alle acht Unterseiten der alten Seite in der neuen Struktur vorhanden sind.
- [ ] Bilder der drei News-Karten, die aktuell in die Schul-Kacheln übernommen werden (`matchingNewsImage`), durch passende Bilder zu den jeweiligen Schulthemen ersetzen, falls die alten Unterseiten eigene Bilder enthalten.

## 3. Kontakt & Technischer Support
Alte Seite enthält deutlich mehr Informationen als aktuell im `contactOverlay` hinterlegt. Die folgenden Inhalte werden 1:1 übernommen und je nach thematischer Passung auf `contactOverlay` oder `supportOverlay` aufgeteilt:

**Bleibt im `contactOverlay`:**
- [ ] **Schulleitung**: Name (Frau Niermann), Foto, Telefon (0203/31879917), Telefax (0203/334745), E-Mail übernehmen.
- [ ] **Sekretariat**: Namen (Frau Weber, Frau Hofmann), Fotos, Öffnungszeiten (7:30–12:30 Uhr), Telefon (0203/332667), Telefax (0203/334745), E-Mail übernehmen.
- [ ] Aktuellen Platzhaltertext für "Schulleitung" und "Sekretariat" im `contactOverlay` durch diese echten Angaben ersetzen; ggf. dritte Karte "Elternvertretung" inhaltlich prüfen/ergänzen (in der alten Seite nicht vorhanden – Herkunft klären).

**Wandert in den `supportOverlay` (Technischer Support):**
- [ ] **IServ-Bereich** vollständig übertragen (aktuell nirgends in der neuen Seite enthalten):
  - Kurzbeschreibung, was IServ ist.
  - Links zu den mobilen Apps (Google Play, Apple App Store).
  - IServ-Webadresse (https://du-als-monti-ggs.de) inkl. Hinweis, dass Zugangsdaten jedes Mal einzugeben sind.
  - Liste der Hilfestellungen: Nutzung des internen Mailsystems, Krankmeldung für den Unterricht, Abmeldung für die OGS, Wechsel des Nutzers in der App.
  - IT-Support-Kontakt (marc.backhaus@du-als-monti-ggs.de).
  - Die drei Erklärvideos (Mailsystem.mp4, Krankmeldung.mp4, Accountwechsel.mp4) sowie den Link zur PDF-Anleitung "So melden Sie ihr Kind für die OGS ab" (OGS_Anleitung_Abwesenheitstool.pdf) einbinden oder verlinken.

## 4. Qualitätssicherung nach der Übertragung
- [ ] Alle Platzhaltertexte ("Blablablablabla" auf der alten "Unsere Schule"-Seite, generische Beispieltexte im `contactOverlay`) sind in den bearbeiteten Bereichen nirgends mehr vorhanden.
- [ ] Alle internen Links/Routen (`#unsere-schule-…`) funktionieren weiterhin nach dem Einpflegen der neuen Artikel-Overlays für die acht Unterseiten.
- [ ] Bilder haben sinnvolle Alt-Texte bzw. sind wie im Original leer (dekorativ), wo das Original das ebenfalls so handhabt.
- [ ] Telefonnummern, E-Mail-Adressen und Öffnungszeiten sind innerhalb der bearbeiteten Bereiche (`contactOverlay`, `supportOverlay`) an genau einer Stelle gepflegt und konsistent übernommen.

---

**In diesem Durchgang bewusst unverändert / ausgelassen:**
- Kopfbereich / Branding (Schulname, Logo, Telefonnummer im Header)
- Hero-Bereich / Hero-Slider (Startseite)
- Neuigkeiten / Aktuelles (`newsOverlay`)
- Impressum (kein neuer Overlay in diesem Durchgang)
- Termine (`datesOverlay`)
- Footer / Fußzeile
