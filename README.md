# Bach-Blüten Harmonie-Rad

Eine moderne Webanwendung zur Verwaltung und Analyse von Bach-Blüten-Beratungen. Entwickelt mit React, TypeScript und Supabase.

## ⚠️ Urheberrecht und Nutzungsrechte

WICHTIG: Diese Software unterliegt strengem Urheberrecht

Copyright © 2024 [Sascha Kohler sk.IT]. Alle Rechte vorbehalten.

Dieses Werk, einschließlich des Quellcodes, der Dokumentation, des Designs und der zugrundeliegenden Konzepte und Ideen, ist urheberrechtlich geschützt. Das geistige Eigentum liegt ausschließlich beim Urheber.

### 🚫 Nicht erlaubt ohne ausdrückliche schriftliche Genehmigung:

- Kopieren oder Vervielfältigen des Codes oder von Codeteilen
- Modifizieren oder Anpassen der Software
- Verwendung des Konzepts oder der Implementierungsideen
- Kommerzielle oder private Nutzung
- Distribution oder Weitergabe in jeglicher Form
- Erstellen von abgeleiteten Werken

### Urheberrechtsverletzungen:

- Werden rechtlich verfolgt
- Können zu Schadensersatzforderungen führen
- Führen zu sofortiger Unterlassungsaufforderung

## 🌸 Über das Projekt

Das Bach-Blüten Harmonie-Rad ist eine professionelle Anwendung für Bach-Blüten-Therapeuten. Sie ermöglicht:

- Visualisierung und Auswahl von Bach-Blüten über ein interaktives Harmonie-Rad
- Verwaltung von Klienten und deren Therapieverläufen
- Dokumentation von Blütenmischungen und Behandlungen
- Lernmodul für die Bach-Blüten-Therapie
- KI-gestützte Beratungsunterstützung

## 🚀 Technologie-Stack

- **Frontend:**

  - React 18 mit TypeScript
  - Vite als Build-Tool
  - TanStack Query für Server-State-Management
  - TanStack Table für Datentabellen
  - Tailwind CSS & shadcn/ui für das UI
  - React Router für das Routing
  - Zod für Schema-Validierung

- **Backend:**

  - Supabase für Datenbank und Authentifizierung
  - PostgreSQL als Datenbank
  - Row Level Security für Datenschutz

- **Testing:**
  - Vitest für Unit Tests
  - React Testing Library für Komponenten-Tests

## 📦 Installation

1. Repository klonen:

```bash
git clone [repository-url]
cd bachblueten-harmonie-rad
```

2. Dependencies installieren:

```bash
npm install
```

3. Umgebungsvariablen einrichten:

```bash
cp .env.example .env
```

Fülle die notwendigen Umgebungsvariablen aus:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

4. Development Server starten:

```bash
npm run dev
```

## 🔧 Verfügbare Scripts

- `npm run dev` - Startet den Development Server
- `npm run build` - Erstellt die Production-Build
- `npm run lint` - Führt ESLint aus
- `npm test` - Führt Tests aus
- `npm run test:watch` - Führt Tests im Watch-Mode aus
- `npm run preview` - Startet den Preview-Server für den Production-Build

## 📚 Projektstruktur

```
src/
├── components/     # Wiederverwendbare UI-Komponenten
├── contexts/       # React Context Provider
├── hooks/         # Custom React Hooks
├── lib/           # Utilities und Services
├── pages/         # Routing-basierte Komponenten
└── types/         # TypeScript Definitionen
```

## 🌟 Hauptfunktionen

### 🎯 Harmonie-Rad

- Interaktive Visualisierung der Bach-Blüten
- Emotionale Zuordnung und Auswahl
- Intuitive Blütenauswahl

### 👥 Klientenverwaltung

- Detaillierte Klientenprofile
- Behandlungshistorie
- Dokumentenverwaltung

### 📊 Blütenmischungen

- Erstellung und Verwaltung von Mischungen
- Dosierungsempfehlungen
- Verlaufsdokumentation

### 📚 Lernmodul

- Strukturierte Lerneinheiten
- Interaktive Quizze
- Fortschrittsverfolgung

### 🤖 KI-Beratung

- KI-gestützte Analysevorschläge
- Interaktiver Beratungsdialog
- Therapieunterstützung

## 🔐 Datenschutz

- Verschlüsselte Datenübertragung
- Row Level Security in der Datenbank
- DSGVO-konforme Datenspeicherung
- Mandantenfähigkeit

## 📝 Kontakt für Lizenzanfragen

Für Lizenzanfragen und Nutzungsrechte kontaktieren Sie bitte:

[Sascha Kohler - sk.IT Software]
[office@sascha-kohler.at]

HINWEIS: Die Einsicht in diesen Code ist ausschließlich zu Demonstrationszwecken gestattet. Jegliche Nutzung, Implementierung oder Adaption bedarf der ausdrücklichen schriftlichen Genehmigung des Urhebers.
