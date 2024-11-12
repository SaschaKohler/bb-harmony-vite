// src/pages/learning-hub/data/lesson-content-registry.tsx
import React from "react";
import type {
  LessonContent,
  Question,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  LessonPage,
} from "./lesson-content";

export const lessonsContent: Record<string, LessonContent> = {
  "basics-history": {
    id: "basics-history",
    moduleId: "basics",
    title: "Geschichte der Bach-Blütentherapie",
    description:
      "Lernen Sie die Geschichte und Entwicklung der Bach-Blütentherapie kennen",
    pages: [
      {
        id: "basics-history-1",
        title: "Dr. Edward Bach",
        content: (
          <>
            <div className="space-y-4">
              <p>
                Dr. Edward Bach (1886-1936) war ein englischer Arzt,
                Bakteriologe und Immunologe. Er entwickelte die
                Bach-Blütentherapie in den 1930er Jahren.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Wichtige Lebensstationen:
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>1886: Geboren in Moseley, Birmingham</li>
                  <li>
                    1912: Abschluss des Medizinstudiums am University College
                    Hospital London
                  </li>
                  <li>
                    1919: Beginn der Arbeit am London Homeopathic Hospital
                  </li>
                  <li>1930: Beginn der Entwicklung der Bach-Blütentherapie</li>
                </ul>
              </div>
            </div>
          </>
        ),
      },
      {
        id: "basics-history-2",
        title: "Entwicklung der Bach-Blütentherapie",
        content: (
          <>
            <div className="space-y-4">
              <p>
                Die Entwicklung der Bach-Blütentherapie erfolgte in mehreren
                Phasen:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Erste Phase (1928-1932)
                  </h4>
                  <ul className="list-disc pl-5">
                    <li>Entdeckung der ersten drei Blüten</li>
                    <li>Entwicklung der Sonnenmethode</li>
                    <li>Erste Dokumentationen der Wirkungen</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Zweite Phase (1932-1935)
                  </h4>
                  <ul className="list-disc pl-5">
                    <li>Entdeckung weiterer Blüten</li>
                    <li>Entwicklung der Kochmethode</li>
                    <li>Systematisierung der Therapie</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ),
      },
      {
        id: "basics-history-3",
        title: "Die Herstellungsmethoden",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              Traditionelle Herstellungsverfahren
            </h3>
            <div className="grid gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Die Sonnenmethode</h4>
                <p>
                  Bei der Sonnenmethode werden frisch gepflückte Blüten in einer
                  Glasschale mit Quellwasser für etwa drei Stunden in die Sonne
                  gelegt. Die Sonnenenergie überträgt dabei die
                  Schwingungsmuster der Blüten auf das Wasser.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Die Kochmethode</h4>
                <p>
                  Bei der Kochmethode werden die Pflanzenteile in Quellwasser
                  für 30 Minuten gekocht. Diese Methode wird vor allem bei
                  Bäumen und holzigen Pflanzen angewendet.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-4",
        title: "Der Weg zur Blütentherapie",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              Von der Schulmedizin zur Naturheilkunde
            </h3>
            <p>
              Dr. Bach's Weg zur Blütentherapie war geprägt von seiner
              wachsenden Unzufriedenheit mit der konventionellen Medizin. Als
              erfolgreicher Chirurg und Bakteriologe beobachtete er, dass
              Patienten mit gleichen Krankheitssymptomen oft unterschiedlich auf
              die gleiche Behandlung reagierten.
            </p>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Wichtige Erkenntnisse:</h4>
              <ul className="list-disc pl-5">
                <li>Jeder Patient ist einzigartig</li>
                <li>Die Persönlichkeit beeinflusst den Heilungsprozess</li>
                <li>Emotionale Harmonie führt zu körperlicher Gesundheit</li>
                <li>Die Natur bietet sanfte Heilmittel</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-5",
        title: "Die Ursprünge der Forschung",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Erste Forschungsarbeiten</h3>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Bakteriologische Forschung
                </h4>
                <p>
                  Als Bakteriologe am London Homeopathic Hospital entdeckte Bach
                  sieben verschiedene Darmbakteriengruppen, die mit spezifischen
                  chronischen Krankheitszuständen in Verbindung standen. Diese
                  "Bach-Nosoden" wurden in der Homöopathie verwendet.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Verbindung zur Homöopathie
                </h4>
                <p>
                  Seine Arbeit mit Nosoden führte ihn zur Homöopathie und zu Dr.
                  Samuel Hahnemann's Erkenntnissen über Persönlichkeitstypen und
                  deren Einfluss auf Krankheit und Heilung.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-6",
        title: "Die ersten Entdeckungen",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Die ersten Blüten</h3>
            <p>
              1928 entdeckte Dr. Bach die ersten drei Blütenessenzen während
              einer Wanderung in Wales. Diese Entdeckung markierte den Beginn
              seiner systematischen Erforschung der Blütentherapie.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impatiens</h4>
                <p>Für Menschen mit Ungeduld und Reizbarkeit</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Mimulus</h4>
                <p>Für bekannte Ängste und Schüchternheit</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Clematis</h4>
                <p>Für Tagträumerei und mangelnde Erdung</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-7",
        title: "Die Vervollständigung des Systems",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Die 38 Blütenessenzen</h3>
            <p>
              Zwischen 1928 und 1936 entwickelte Dr. Bach sein System von 38
              Blütenessenzen. Jede Essenz wurde sorgfältig ausgewählt und
              getestet, um spezifische emotionale Zustände anzusprechen.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Die sieben Grundzustände:</h4>
              <ul className="list-disc pl-5">
                <li>Angst</li>
                <li>Unsicherheit</li>
                <li>Mangelndes Interesse an der Gegenwart</li>
                <li>Einsamkeit</li>
                <li>Überempfindlichkeit</li>
                <li>Verzweiflung</li>
                <li>Übermäßige Sorge um andere</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-8",
        title: "Die Notfallmischung",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Rescue Remedy</h3>
            <p>
              Eine besondere Entwicklung war die "Rescue Remedy" oder
              "Notfalltropfen", eine Kombination aus fünf Blütenessenzen für
              akute Stresssituationen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Zusammensetzung:</h4>
                <ul className="list-disc pl-5">
                  <li>Star of Bethlehem - für Schock</li>
                  <li>Rock Rose - für Panik und Terror</li>
                  <li>Cherry Plum - für Kontrollverlustangst</li>
                  <li>Clematis - für die Erdung</li>
                  <li>Impatiens - für Anspannung</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Anwendungsgebiete:</h4>
                <ul className="list-disc pl-5">
                  <li>Unfälle</li>
                  <li>Schocksituationen</li>
                  <li>Prüfungsangst</li>
                  <li>Akuter Stress</li>
                  <li>Emotionale Krisen</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-9",
        title: "Bach's Philosophie",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Grundlegende Prinzipien</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="italic mb-4">
                "Krankheit ist keine Grausamkeit, auch keine Strafe, sondern
                lediglich ein Korrektiv, ein Instrument, dessen sich unsere
                Seele bedient, um uns auf unsere Fehler hinzuweisen."
              </p>
              <p className="text-right">- Dr. Edward Bach</p>
            </div>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Kernüberzeugungen:</h4>
                <ul className="list-disc pl-5">
                  <li>Die Einfachheit der Heilung</li>
                  <li>Die Einheit von Körper und Seele</li>
                  <li>Die Heilkraft der Natur</li>
                  <li>Die Individualität jedes Menschen</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-10",
        title: "Verbreitung und Anerkennung",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Weltweite Entwicklung</h3>
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Wichtige Meilensteine:</h4>
                <ul className="list-disc pl-5">
                  <li>1936: Gründung des Bach Centre in Mount Vernon</li>
                  <li>1941: Erste offizielle Anerkennung in England</li>
                  <li>1976: Aufnahme in das britische Arzneibuch</li>
                  <li>1980er: Internationale Verbreitung</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Das Bach Centre heute:</h4>
                <p>
                  Das Bach Centre in Mount Vernon, England, bewahrt das Erbe Dr.
                  Bachs und gewährleistet die Qualität der Original
                  Bach-Blütentherapie durch Ausbildung und Zertifizierung von
                  Therapeuten weltweit.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-11",
        title: "Wissenschaftliche Perspektive",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Forschung und Studien</h3>
            <div className="grid gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Wirkungsweise</h4>
                <p>
                  Die Bach-Blütentherapie basiert auf dem Prinzip der
                  Energieübertragung. Die Schwingungsmuster der Blüten werden
                  auf das Wasser übertragen und können so die emotionale Balance
                  wiederherstellen.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Moderne Untersuchungen</h4>
                <ul className="list-disc pl-5">
                  <li>Placebo-kontrollierte Studien</li>
                  <li>Praxiserfahrungen</li>
                  <li>Fallstudien</li>
                  <li>Qualitative Forschung</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-12",
        title: "Bach's Vermächtnis",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Bedeutung für die Gegenwart</h3>
            <p>
              Dr. Bach's Arbeit hat die Naturheilkunde nachhaltig geprägt und
              den Weg für ein ganzheitliches Verständnis von Gesundheit und
              Heilung geebnet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Einfluss auf die Medizin:
                </h4>
                <ul className="list-disc pl-5">
                  <li>Ganzheitlicher Behandlungsansatz</li>
                  <li>Bedeutung der Psychosomatik</li>
                  <li>Individualisierte Therapie</li>
                  <li>Präventive Gesundheitsvorsorge</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Moderne Anwendungen:</h4>
                <ul className="list-disc pl-5">
                  <li>Stress-Management</li>
                  <li>Emotionale Selbsthilfe</li>
                  <li>Komplementärmedizin</li>
                  <li>Persönlichkeitsentwicklung</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
    ],
    quiz: {
      questions: [
        // Single Choice
        {
          type: "single",
          question: "Wann wurde Dr. Edward Bach geboren?",
          options: ["1876", "1886", "1896", "1906"],
          correctAnswer: 1,
          explanation: "Dr. Edward Bach wurde 1886 geboren.",
        },
        // Multiple Choice
        {
          type: "multiple",
          question:
            "Welche beruflichen Tätigkeiten übte Dr. Bach aus? (Mehrere Antworten möglich)",
          options: [
            "Schulmediziner",
            "Bakteriologe",
            "Psychologe",
            "Homöopath",
            "Apotheker",
          ],
          correctAnswers: [0, 1, 3],
          explanation:
            "Dr. Bach war ausgebildeter Schulmediziner, arbeitete als Bakteriologe und später als Homöopath.",
        },
        {
          type: "multiple",
          question:
            "Welche Entwicklungen fanden in der ersten Phase (1928-1932) statt?",
          options: [
            "Entdeckung der ersten drei Blüten",
            "Entwicklung der Sonnenmethode",
            "Entwicklung der Kochmethode",
            "Systematisierung der Therapie",
            "Erste Dokumentationen der Wirkungen",
          ],
          correctAnswers: [0, 1, 4],
          explanation:
            "In der ersten Phase entdeckte Bach die ersten drei Blüten, entwickelte die Sonnenmethode und dokumentierte erste Wirkungen.",
        },
        {
          type: "single",
          question:
            "In welchem Jahr begann Dr. Bach mit der Entwicklung der Bach-Blütentherapie?",
          options: ["1928", "1930", "1932", "1934"],
          correctAnswer: 1,
          explanation:
            "Dr. Bach begann 1930 mit der systematischen Entwicklung der Bach-Blütentherapie.",
        },
        {
          type: "multiple",
          question: "Welche Merkmale kennzeichnen die Sonnenmethode?",
          options: [
            "Verwendung von Quellwasser",
            "Drei Stunden Sonnenexposition",
            "Kochen der Blüten",
            "Verwendung einer Glasschale",
            "Nächtliche Exposition",
          ],
          correctAnswers: [0, 1, 3],
          explanation:
            "Die Sonnenmethode verwendet Quellwasser in einer Glasschale und benötigt drei Stunden Sonnenexposition.",
        },
        {
          type: "multiple",
          question: "Welche Blüten gehören zur Rescue Remedy?",
          options: [
            "Star of Bethlehem",
            "Rock Rose",
            "Mimulus",
            "Cherry Plum",
            "Clematis",
          ],
          correctAnswers: [0, 1, 3, 4],
          explanation:
            "Die Rescue Remedy enthält Star of Bethlehem, Rock Rose, Cherry Plum, Clematis und Impatiens (nicht Mimulus).",
        },
        {
          type: "single",
          question:
            "In welchem Jahr wurde das Bach Centre in Mount Vernon gegründet?",
          options: ["1930", "1934", "1936", "1938"],
          correctAnswer: 2,
          explanation: "Das Bach Centre wurde 1936 in Mount Vernon gegründet.",
        },
        {
          type: "multiple",
          question:
            "Welche der folgenden Aussagen entsprechen Dr. Bach's Philosophie?",
          options: [
            "Krankheit ist ein Korrektiv",
            "Körper und Seele sind eine Einheit",
            "Komplexe Behandlungen sind am effektivsten",
            "Die Natur bietet sanfte Heilmittel",
            "Alle Menschen sollten gleich behandelt werden",
          ],
          correctAnswers: [0, 1, 3],
          explanation:
            "Dr. Bach glaubte an die Einheit von Körper und Seele, die heilende Kraft der Natur und sah Krankheit als Korrektiv.",
        },
        {
          type: "multiple",
          question:
            "Welche Entdeckungen machte Dr. Bach in der ersten Phase (1928-1932)?",
          options: [
            "Die ersten drei Blütenessenzen",
            "Die Sonnenmethode",
            "Die Kochmethode",
            "Die Rescue Remedy",
            "Erste Dokumentationen der Wirkungen",
          ],
          correctAnswers: [0, 1, 4],
          explanation:
            "In der ersten Phase entdeckte er die ersten drei Blüten, entwickelte die Sonnenmethode und dokumentierte erste Wirkungen.",
        },
        {
          type: "single",
          question:
            "Wann wurde die Bach-Blütentherapie ins britische Arzneibuch aufgenommen?",
          options: ["1966", "1976", "1986", "1996"],
          correctAnswer: 1,
          explanation:
            "Die Bach-Blütentherapie wurde 1976 offiziell ins britische Arzneibuch aufgenommen.",
        },
        {
          type: "multiple",
          question: "Was kennzeichnet die Kochmethode?",
          options: [
            "Verwendung von Quellwasser",
            "30-minütiges Kochen",
            "Anwendung bei holzigen Pflanzen",
            "Dreistündige Sonnenexposition",
            "Verwendung von Regenwasser",
          ],
          correctAnswers: [0, 1, 2],
          explanation:
            "Die Kochmethode verwendet Quellwasser, benötigt 30 Minuten Kochzeit und wird hauptsächlich bei holzigen Pflanzen angewendet.",
        },
        {
          type: "multiple",
          question:
            "Welche der folgenden Persönlichkeitsmerkmale werden von den ersten drei Blüten behandelt?",
          options: [
            "Ungeduld",
            "Bekannte Ängste",
            "Tagträumerei",
            "Wut",
            "Einsamkeit",
          ],
          correctAnswers: [0, 1, 2],
          explanation:
            "Die ersten drei Blüten waren Impatiens (Ungeduld), Mimulus (bekannte Ängste) und Clematis (Tagträumerei).",
        },
        {
          type: "single",
          question:
            "Wie viele Blütenessenzen umfasst das vollständige Bach-Blüten-System?",
          options: ["28", "38", "48", "58"],
          correctAnswer: 1,
          explanation:
            "Das vollständige Bach-Blüten-System umfasst genau 38 Blütenessenzen.",
        },
        {
          type: "multiple",
          question:
            "Welche Grundzustände definierte Dr. Bach in seinem System?",
          options: [
            "Angst",
            "Unsicherheit",
            "Euphorie",
            "Einsamkeit",
            "Überempfindlichkeit",
          ],
          correctAnswers: [0, 1, 3, 4],
          explanation:
            "Angst, Unsicherheit, Einsamkeit und Überempfindlichkeit gehören zu den von Dr. Bach definierten Grundzuständen.",
        },
        {
          type: "multiple",
          question:
            "Welche modernen Anwendungsgebiete hat die Bach-Blütentherapie?",
          options: [
            "Stress-Management",
            "Operative Eingriffe",
            "Emotionale Selbsthilfe",
            "Persönlichkeitsentwicklung",
            "Labordiagnostik",
          ],
          correctAnswers: [0, 2, 3],
          explanation:
            "Moderne Anwendungsgebiete sind Stress-Management, emotionale Selbsthilfe und Persönlichkeitsentwicklung.",
        },
      ] as Question[], // Type Assertion für korrekte Typisierung
    },
  },
  // Weitere Lektionsinhalte...
};

// Helper-Funktionen für den Zugriff auf Lektionsinhalte
export const getLessonContent = (contentKey: string): LessonContent | null => {
  const content = lessonsContent[contentKey] || null;
  if (!content) {
    console.error(`Kein Content gefunden für key: ${contentKey}`);
    return null;
  }
  return content;
};

// Neue Helper-Funktionen für spezifische Abfragen
export const getLessonQuestions = (contentKey: string): Question[] => {
  return lessonsContent[contentKey]?.quiz?.questions || [];
};

export const getLessonPages = (contentKey: string): LessonPage[] => {
  const pages = lessonsContent[contentKey]?.pages;
  return pages || [];
};

// Type Guard Funktionen für die Fragen-Typen
export const isSingleChoiceQuestion = (
  question: Question,
): question is SingleChoiceQuestion => {
  return question.type === "single";
};

export const isMultipleChoiceQuestion = (
  question: Question,
): question is MultipleChoiceQuestion => {
  return question.type === "multiple";
};
