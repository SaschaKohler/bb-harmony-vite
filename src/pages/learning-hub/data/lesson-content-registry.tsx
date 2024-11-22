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
        title: "Dr. Edward Bach - Der Mensch",
        content: (
          <div className="space-y-4">
            <p>
              Dr. Edward Bach (1886-1936) war ein englischer Arzt, Bakteriologe
              und Immunologe, dessen Weg von der konventionellen Medizin zur
              Naturheilkunde das Gesundheitswesen nachhaltig prägte.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Wichtige Lebensstationen:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>1886: Geboren in Moseley, Birmingham</li>
                <li>
                  1912: Abschluss des Medizinstudiums am University College
                  Hospital London
                </li>
                <li>1919-1922: Tätigkeit am London Homeopathic Hospital</li>
                <li>1930: Beginn der systematischen Blütenforschung</li>
                <li>1936: Vollendung des 38-Blüten-Systems</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-2",
        title: "Vom Schulmediziner zum Naturheiler",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Der wissenschaftliche Weg</h3>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Bakteriologische Forschung
                </h4>
                <p>
                  Als anerkannter Bakteriologe entdeckte Bach sieben
                  verschiedene Darmbakteriengruppen und ihre Verbindung zu
                  chronischen Krankheiten. Diese "Bach-Nosoden" waren sein
                  erster Schritt in Richtung ganzheitlicher Behandlung.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Schlüsselerkenntnisse</h4>
                <ul className="list-disc pl-5">
                  <li>Zusammenhang zwischen Persönlichkeit und Krankheit</li>
                  <li>Individualität der Krankheitsverarbeitung</li>
                  <li>Bedeutung der emotionalen Balance</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-3",
        title: "Grundlagen der Bach-Blütentherapie",
        content: (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Philosophische Basis</h4>
              <p className="italic mb-4">
                "Krankheit ist keine Grausamkeit, auch keine Strafe, sondern
                lediglich ein Korrektiv, ein Instrument, dessen sich unsere
                Seele bedient."
              </p>
            </div>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Kernprinzipien:</h4>
                <ul className="list-disc pl-5">
                  <li>Einheit von Körper und Seele</li>
                  <li>Individualität der Behandlung</li>
                  <li>Heilkraft der Natur</li>
                  <li>Prävention durch emotionale Balance</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-4",
        title: "Entwicklung des Blütensystems",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Phase 1 (1928-1932)</h4>
                <ul className="list-disc pl-5">
                  <li>
                    Entdeckung der ersten drei Blüten:
                    <ul className="pl-5">
                      <li>Impatiens - Ungeduld</li>
                      <li>Mimulus - Bekannte Ängste</li>
                      <li>Clematis - Realitätsferne</li>
                    </ul>
                  </li>
                  <li>Entwicklung der Sonnenmethode</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Phase 2 (1932-1935)</h4>
                <ul className="list-disc pl-5">
                  <li>Entwicklung der Kochmethode</li>
                  <li>Systematische Erforschung weiterer Blüten</li>
                  <li>Kategorisierung der emotionalen Zustände</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-5",
        title: "Herstellungsmethoden",
        content: (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Die Sonnenmethode</h4>
                <p>
                  Für zarte Blüten: Dreistündige Sonnenexposition in Quellwasser
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Natürliche Energieübertragung</li>
                  <li>Verwendung von Morgentau</li>
                  <li>Glasschalen als Medium</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Die Kochmethode</h4>
                <p>Für Bäume und holzige Pflanzen: 30-minütiges Kochen</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Verwendung junger Triebe</li>
                  <li>Quellwasser als Basis</li>
                  <li>Spezielle Zubereitung für Knospen</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-6",
        title: "Das vollständige System",
        content: (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Die 38 Blütenessenzen</h3>
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Die sieben Grundthemen:</h4>
                <ul className="list-disc pl-5">
                  <li>Angst und ihre Erscheinungsformen</li>
                  <li>Unsicherheit in Entscheidungen</li>
                  <li>Mangelnde Gegenwärtigkeit</li>
                  <li>Einsamkeit und Isolation</li>
                  <li>Überempfindlichkeit gegenüber Einflüssen</li>
                  <li>Mutlosigkeit und Verzweiflung</li>
                  <li>Übermäßige Sorge um andere</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-7",
        title: "Wissenschaftliche Grundlagen",
        content: (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Wirkungsprinzipien</h4>
                <ul className="list-disc pl-5">
                  <li>Energetische Übertragung</li>
                  <li>Informationsspeicherung im Wasser</li>
                  <li>Resonanzprinzip mit emotionalen Zuständen</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Moderne Forschung</h4>
                <ul className="list-disc pl-5">
                  <li>Klinische Beobachtungsstudien</li>
                  <li>Dokumentierte Fallberichte</li>
                  <li>Wissenschaftliche Evaluation der Wirksamkeit</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "basics-history-8",
        title: "Moderne Anwendung und Bedeutung",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Aktuelle Einsatzgebiete:</h4>
                <ul className="list-disc pl-5">
                  <li>Emotionale Selbstregulation</li>
                  <li>Stressmanagement</li>
                  <li>Persönlichkeitsentwicklung</li>
                  <li>Präventive Gesundheitsvorsorge</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Integration in die Medizin:
                </h4>
                <ul className="list-disc pl-5">
                  <li>Komplementärmedizinischer Ansatz</li>
                  <li>Ganzheitliche Therapiekonzepte</li>
                  <li>Psychosomatische Behandlung</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
    ],
    quiz: {
      questions: [
        // Biografisches Verständnis
        {
          type: "single",
          question: "Was war Dr. Bachs ursprünglicher beruflicher Hintergrund?",
          options: [
            "Ausschließlich Homöopath",
            "Schulmediziner und Bakteriologe",
            "Botaniker und Naturheilkundler",
            "Apotheker und Chemiker",
          ],
          correctAnswer: 1,
          explanation:
            "Dr. Bach begann seine Karriere als Schulmediziner und Bakteriologe, bevor er sich der Naturheilkunde zuwandte.",
        },

        // Wissenschaftlicher Werdegang
        {
          type: "multiple",
          question:
            "Welche wissenschaftlichen Entdeckungen machte Dr. Bach vor der Entwicklung der Blütentherapie?",
          options: [
            "Erforschung von Darmbakteriengruppen",
            "Entwicklung der Bach-Nosoden",
            "Erfindung der Homöopathie",
            "Entdeckung der Sonnenmethode",
            "Zusammenhang zwischen Persönlichkeit und Krankheit",
          ],
          correctAnswers: [0, 1, 4],
          explanation:
            "Bach erforschte Darmbakterien, entwickelte die Bach-Nosoden und erkannte den Zusammenhang zwischen Persönlichkeit und Krankheit.",
        },

        // Philosophische Grundlagen
        {
          type: "multiple",
          question:
            "Welche Kernprinzipien bilden die Basis der Bach-Blütentherapie?",
          options: [
            "Einheit von Körper und Seele",
            "Ausschließlich physische Behandlung",
            "Individualität der Behandlung",
            "Standardisierte Therapieprotokolle",
            "Heilkraft der Natur",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Die Therapie basiert auf der Einheit von Körper und Seele, individueller Behandlung und der Heilkraft der Natur.",
        },

        // Entwicklungsphasen
        {
          type: "multiple",
          question: "Was kennzeichnet die erste Entwicklungsphase (1928-1932)?",
          options: [
            "Entdeckung der ersten drei Blüten",
            "Entwicklung der Sonnenmethode",
            "Entwicklung der Kochmethode",
            "Systematisierung aller 38 Blüten",
            "Erste Dokumentationen der Wirkungen",
          ],
          correctAnswers: [0, 1, 4],
          explanation:
            "Die erste Phase war geprägt von der Entdeckung der ersten drei Blüten, der Entwicklung der Sonnenmethode und ersten Wirkungsdokumentationen.",
        },

        // Herstellungsmethoden
        {
          type: "single",
          question:
            "Bei welchen Pflanzenteilen wird die Kochmethode angewendet?",
          options: [
            "Bei allen Blüten",
            "Bei zarten Frühlingsblüten",
            "Bei Bäumen und holzigen Pflanzen",
            "Bei Wurzeln und Knollen",
          ],
          correctAnswer: 2,
          explanation:
            "Die Kochmethode wird speziell bei Bäumen und holzigen Pflanzen angewendet.",
        },

        // Systematische Einordnung
        {
          type: "multiple",
          question:
            "Welche der sieben Grundthemen behandelt die Bach-Blütentherapie?",
          options: [
            "Angst und ihre Erscheinungsformen",
            "Physische Schmerzen",
            "Mangelnde Gegenwärtigkeit",
            "Chronische Erkrankungen",
            "Überempfindlichkeit gegenüber Einflüssen",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Angst, mangelnde Gegenwärtigkeit und Überempfindlichkeit sind drei der sieben Grundthemen.",
        },

        // Wissenschaftliche Grundlagen
        {
          type: "multiple",
          question:
            "Auf welchen Wirkungsprinzipien basiert die Bach-Blütentherapie?",
          options: [
            "Energetische Übertragung",
            "Chemische Reaktionen",
            "Informationsspeicherung im Wasser",
            "Resonanz mit emotionalen Zuständen",
            "Biochemische Prozesse",
          ],
          correctAnswers: [0, 2, 3],
          explanation:
            "Die Therapie basiert auf energetischer Übertragung, Informationsspeicherung im Wasser und Resonanz mit emotionalen Zuständen.",
        },

        // Moderne Anwendung
        {
          type: "multiple",
          question:
            "In welchen modernen Bereichen findet die Bach-Blütentherapie Anwendung?",
          options: [
            "Emotionale Selbstregulation",
            "Chirurgische Eingriffe",
            "Stressmanagement",
            "Labordiagnostik",
            "Präventive Gesundheitsvorsorge",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Die Therapie wird heute besonders in der emotionalen Selbstregulation, im Stressmanagement und in der Prävention eingesetzt.",
        },

        // Vertiefendes Wissen - Sonnenmethode
        {
          type: "multiple",
          question: "Welche Faktoren sind bei der Sonnenmethode wichtig?",
          options: [
            "Verwendung von Quellwasser",
            "Dreistündige Sonnenexposition",
            "Verwendung von Metallschalen",
            "Mondphasenbeachtung",
            "Verwendung von Glasschalen",
          ],
          correctAnswers: [0, 1, 4],
          explanation:
            "Die Sonnenmethode erfordert Quellwasser, eine dreistündige Sonnenexposition und die Verwendung von Glasschalen.",
        },

        // Vertiefendes Wissen - Erste Blüten
        {
          type: "multiple",
          question:
            "Welche emotionalen Zustände behandeln die ersten drei entdeckten Blüten?",
          options: [
            "Ungeduld",
            "Unentschlossenheit",
            "Bekannte Ängste",
            "Realitätsferne",
            "Wut",
          ],
          correctAnswers: [0, 2, 3],
          explanation:
            "Die ersten drei Blüten behandeln Ungeduld (Impatiens), bekannte Ängste (Mimulus) und Realitätsferne (Clematis).",
        },
      ] as Question[], // Type Assertion für korrekte Typisierung
    },
  },
  "basics-philosophy": {
    id: "basics-philosophy",
    moduleId: "basics",
    title: "Philosophie und Grundprinzipien der Bach-Blütentherapie",
    description:
      "Verstehen Sie die philosophischen Grundlagen und deren praktische Bedeutung für die Bach-Blütentherapie",
    pages: [
      {
        id: "basics-philosophy-1",
        title: "Ganzheitliches Menschenbild",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Das holistische Prinzip</h4>
              <p>
                Die Bach-Blütentherapie basiert auf einem ganzheitlichen
                Verständnis des Menschen, das über das rein körperliche
                hinausgeht. Sie betrachtet den Menschen als Einheit von:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Körper (physische Ebene)</li>
                <li>Seele (emotionale Ebene)</li>
                <li>Geist (mentale Ebene)</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Praxisrelevanz:</h4>
              <p>
                Dieses Verständnis erfordert einen therapeutischen Ansatz, der:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Die individuelle Lebensgeschichte berücksichtigt</li>
                <li>Aktuelle Lebenssituation einbezieht</li>
                <li>Persönliche Entwicklungspotenziale erkennt</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-philosophy-2",
        title: "Das Verständnis von Gesundheit und Krankheit",
        content: (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Gesundheit als Harmonie</h4>
              <p>
                Nach Dr. Bach ist Gesundheit mehr als die Abwesenheit von
                Krankheit. Sie ist ein Zustand der Harmonie zwischen:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Körperlicher Vitalität</li>
                <li>Emotionaler Balance</li>
                <li>Mentaler Klarheit</li>
                <li>Spirituellem Wohlbefinden</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Krankheit als Botschaft</h4>
              <blockquote className="italic border-l-4 pl-4 my-2">
                "Krankheit ist in ihrer Endursache so unmateriell wie das Gemüt
                selbst. Sie ist die Verkörperung einer mentalen Einstellung." -
                Dr. Edward Bach
              </blockquote>
              <p>Krankheit wird verstanden als:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Signal für innere Disharmonie</li>
                <li>Chance zur Entwicklung</li>
                <li>Wegweiser für notwendige Veränderungen</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-philosophy-3",
        title: "Die Rolle der Emotionen",
        content: (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Emotionale Balance als Schlüssel
              </h4>
              <p>
                Dr. Bach erkannte Emotionen als zentrale Kraft für Gesundheit
                und Krankheit:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Positive Emotionen stärken die Lebenskraft</li>
                <li>Negative Emotionen schwächen das Energiesystem</li>
                <li>Verdrängte Gefühle können krank machen</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Therapeutische Konsequenz:</h4>
              <p>Die Behandlung zielt auf:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Bewusstwerdung emotionaler Muster</li>
                <li>Transformation negativer Gefühlszustände</li>
                <li>Entwicklung emotionaler Resilienz</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-philosophy-4",
        title: "Das Prinzip der Individualität",
        content: (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Jeder Mensch ist einzigartig
              </h4>
              <p>
                Die Bach-Blütentherapie respektiert die Individualität auf
                mehreren Ebenen:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Persönliche Lebensgeschichte</li>
                <li>Individuelle Reaktionsmuster</li>
                <li>Eigener Entwicklungsweg</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Praktische Umsetzung:</h4>
              <p>Dies bedeutet für die Therapie:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Keine standardisierten Behandlungsschemata</li>
                <li>Individuelle Blütenkombinationen</li>
                <li>Respekt vor dem persönlichen Entwicklungstempo</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-philosophy-5",
        title: "Selbstheilungskräfte und Naturheilkunde",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Vertrauen in die Naturheilkraft
              </h4>
              <p>
                Ein zentrales Prinzip ist das Vertrauen in die natürlichen
                Heilungsprozesse:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Aktivierung der Selbstheilungskräfte</li>
                <li>Unterstützung durch Naturenergien</li>
                <li>Sanfte Begleitung statt Intervention</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Therapeutische Haltung:</h4>
              <p>Der Therapeut versteht sich als:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Begleiter des Heilungsprozesses</li>
                <li>Unterstützer der Selbstheilungskräfte</li>
                <li>Vermittler zwischen Mensch und Natur</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-philosophy-6",
        title: "Ethische Grundsätze",
        content: (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Therapeutische Ethik</h4>
              <p>Die Bach-Blütentherapie folgt klaren ethischen Prinzipien:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Respekt vor der Autonomie des Menschen</li>
                <li>Förderung der Selbsterkenntnis</li>
                <li>Unterstützung der persönlichen Entwicklung</li>
              </ul>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Praktische Umsetzung:</h4>
              <p>Dies bedeutet im therapeutischen Alltag:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Keine Abhängigkeit erzeugen</li>
                <li>Transparenz in der Behandlung</li>
                <li>Förderung der Selbstkompetenz</li>
                <li>Respektvoller Umgang mit Grenzen</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-philosophy-7",
        title: "Integration in die moderne Heilkunde",
        content: (
          <div className="space-y-4">
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Komplementärer Ansatz</h4>
              <p>Die Bach-Blütentherapie versteht sich als:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Ergänzung zur konventionellen Medizin</li>
                <li>Teil eines integrativen Gesundheitskonzepts</li>
                <li>Brücke zwischen traditioneller und moderner Heilkunst</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Moderne Anwendung:</h4>
              <p>Aktuelle Integrationsmöglichkeiten:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Psychosomatische Medizin</li>
                <li>Präventive Gesundheitsförderung</li>
                <li>Begleitende Therapie bei chronischen Erkrankungen</li>
                <li>Stress- und Burnout-Prävention</li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    quiz: {
      questions: [
        {
          type: "multiple",
          question:
            "Welche Aspekte umfasst das ganzheitliche Menschenbild der Bach-Blütentherapie?",
          options: [
            "Körperliche Ebene",
            "Emotionale Ebene",
            "Genetische Disposition",
            "Mentale Ebene",
            "Laborwerte",
          ],
          correctAnswers: [0, 1, 3],
          explanation:
            "Das holistische Menschenbild der Bach-Blütentherapie betrachtet den Menschen als Einheit von Körper (physisch), Seele (emotional) und Geist (mental).",
        },
        {
          type: "single",
          question: "Wie wird Krankheit in der Bach-Blütentherapie verstanden?",
          options: [
            "Als rein körperliche Störung",
            "Als Strafe für Fehlverhalten",
            "Als Signal für innere Disharmonie und Entwicklungschance",
            "Als unvermeidbares Schicksal",
          ],
          correctAnswer: 2,
          explanation:
            "Krankheit wird als Signal für innere Disharmonie und als Chance zur persönlichen Entwicklung verstanden.",
        },
        {
          type: "multiple",
          question:
            "Welche Rolle spielen Emotionen in der Bach-Blütentherapie?",
          options: [
            "Sie sind zentral für Gesundheit und Krankheit",
            "Sie sind irrelevant für den Heilungsprozess",
            "Positive Emotionen stärken die Lebenskraft",
            "Negative Emotionen haben keine Auswirkung",
            "Verdrängte Gefühle können krank machen",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Emotionen werden als zentrale Kraft für Gesundheit erkannt, wobei positive Emotionen stärkend wirken und verdrängte Gefühle krank machen können.",
        },
        {
          type: "multiple",
          question:
            "Was bedeutet das Prinzip der Individualität in der Praxis?",
          options: [
            "Standardisierte Behandlungsschemata",
            "Individuelle Blütenkombinationen",
            "Respekt vor dem persönlichen Entwicklungstempo",
            "Einheitliche Dosierung für alle",
            "Berücksichtigung der persönlichen Lebensgeschichte",
          ],
          correctAnswers: [1, 2, 4],
          explanation:
            "Das Individualitätsprinzip äußert sich in individuellen Blütenkombinationen, Respekt vor dem persönlichen Tempo und Berücksichtigung der Lebensgeschichte.",
        },
        {
          type: "multiple",
          question:
            "Welche ethischen Grundsätze gelten in der Bach-Blütentherapie?",
          options: [
            "Respekt vor der Autonomie des Menschen",
            "Erzeugung von Abhängigkeit",
            "Förderung der Selbsterkenntnis",
            "Manipulation des Patienten",
            "Transparenz in der Behandlung",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Zentrale ethische Grundsätze sind Respekt vor der Autonomie, Förderung der Selbsterkenntnis",
        },
        {
          type: "multiple",
          question: "Wie versteht sich die Rolle des Bach-Blüten-Therapeuten?",
          options: [
            "Als Begleiter des Heilungsprozesses",
            "Als alleiniger Experte für Heilung",
            "Als Vermittler zwischen Mensch und Natur",
            "Als Autorität über den Patienten",
            "Als Unterstützer der Selbstheilungskräfte",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Der Therapeut versteht sich als begleitender Unterstützer und Vermittler, nicht als autoritäre Instanz.",
        },

        {
          type: "single",
          question:
            "Was bedeutet 'Gesundheit' im Sinne der Bach-Blütentherapie?",
          options: [
            "Ausschließlich die Abwesenheit von körperlichen Symptomen",
            "Ein Zustand der Harmonie zwischen körperlicher, emotionaler und mentaler Ebene",
            "Die Einnahme der richtigen Medikamente",
            "Die Vermeidung aller negativen Gefühle",
          ],
          correctAnswer: 1,
          explanation:
            "Gesundheit wird als harmonischer Zustand auf allen Ebenen des Menschseins verstanden.",
        },

        {
          type: "multiple",
          question:
            "Welche Aspekte kennzeichnen den komplementären Ansatz der Bach-Blütentherapie?",
          options: [
            "Integration in ganzheitliche Behandlungskonzepte",
            "Ablehnung konventioneller Medizin",
            "Ergänzung zur schulmedizinischen Behandlung",
            "Ausschließliche Nutzung als Monotherapie",
            "Einsatz in der Prävention",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Die Therapie versteht sich als komplementärer Ansatz, der andere Behandlungsformen ergänzt und in der Prävention eingesetzt werden kann.",
        },

        {
          type: "multiple",
          question:
            "Welche Prinzipien gelten für die Selbstheilungskräfte in der Bach-Blütentherapie?",
          options: [
            "Aktivierung natürlicher Heilungsprozesse",
            "Unterdrückung von Symptomen",
            "Unterstützung durch Naturenergien",
            "Forcierte Intervention",
            "Sanfte Begleitung des Heilungsweges",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Die Therapie setzt auf die Aktivierung und sanfte Unterstützung natürlicher Heilungsprozesse durch Naturenergien.",
        },

        {
          type: "multiple",
          question:
            "Wie äußert sich der Respekt vor der Individualität in der therapeutischen Praxis?",
          options: [
            "Berücksichtigung des persönlichen Entwicklungstempos",
            "Standardisierte Behandlungsprotokolle",
            "Individuelle Anpassung der Blütenkombinationen",
            "Einheitliche Therapiedauer für alle",
            "Einbeziehung der individuellen Lebenssituation",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Individualität zeigt sich in der Berücksichtigung des persönlichen Tempos, individuellen Blütenkombinationen und der Lebenssituation.",
        },

        {
          type: "single",
          question:
            "Welche Bedeutung haben negative Emotionen in der Bach-Blütentherapie?",
          options: [
            "Sie müssen vollständig vermieden werden",
            "Sie sind wertvolle Hinweise auf Entwicklungspotenziale",
            "Sie haben keine Bedeutung für die Therapie",
            "Sie werden medikamentös unterdrückt",
          ],
          correctAnswer: 1,
          explanation:
            "Negative Emotionen werden als wichtige Signale und Entwicklungschancen verstanden, nicht als zu vermeidende Störungen.",
        },

        {
          type: "multiple",
          question:
            "Welche modernen Anwendungsgebiete hat die Bach-Blütentherapie?",
          options: [
            "Psychosomatische Begleitung",
            "Chirurgische Eingriffe",
            "Stress- und Burnout-Prävention",
            "Labordiagnostik",
            "Emotionale Selbstregulation",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Die Therapie findet heute besonders in der Psychosomatik, Prävention und emotionalen Selbstregulation Anwendung.",
        },
      ] as Question[],
    },
  },
  "basics-mechanisms": {
    id: "basics-mechanisms",
    moduleId: "basics",
    title: "Wirkungsprinzipien der Bach-Blüten",
    description:
      "Verstehen Sie die grundlegenden Wirkungsmechanismen der Bach-Blütentherapie",
    pages: [
      {
        id: "basics-mechanisms-1",
        title: "Grundlagen der energetischen Wirkung",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Energetische Grundprinzipien
              </h4>
              <p>
                Die Bach-Blütentherapie basiert auf dem Verständnis subtiler
                Energien:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Schwingungsmuster der Blüten</li>
                <li>Informationsübertragung durch Wasser</li>
                <li>Resonanzprinzip mit menschlichen Energiefeldern</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Wissenschaftlicher Kontext:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Quantenphysikalische Betrachtungen</li>
                <li>Wassercluster und Informationsspeicherung</li>
                <li>Bioenergetische Felder des Menschen</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-mechanisms-2",
        title: "Die Sonnenmethode im Detail",
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Physikalische Prinzipien</h4>
              <p>
                Bei der Sonnenmethode wirken verschiedene physikalische
                Faktoren:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Elektromagnetische Strahlung der Sonne</li>
                <li>Strukturierung des Wassers</li>
                <li>Photochemische Prozesse</li>
                <li>Energetische Übertragung der Blüteninformation</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Praktische Aspekte:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Bedeutung der Wasserqualität</li>
                <li>Einfluss der Sonnenintensität</li>
                <li>Rolle des Materials (Glas)</li>
                <li>Zeitfaktor der Exposition</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-mechanisms-3",
        title: "Die Kochmethode und ihre Wirkung",
        content: (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Thermodynamische Prozesse</h4>
              <p>
                Die Kochmethode nutzt thermische Energie zur
                Informationsübertragung:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Energieübertragung durch Erhitzen</li>
                <li>Extraktion ätherischer Bestandteile</li>
                <li>Strukturveränderungen im Wasser</li>
                <li>Potenzierung der Blüteninformation</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Anwendungsprinzipien:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Optimale Kochdauer</li>
                <li>Bedeutung der Pflanzenauswahl</li>
                <li>Qualität der Gefäße</li>
                <li>Abkühlungsprozess</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-mechanisms-4",
        title: "Informationsübertragung im Wasser",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Wasserstruktur und Information
              </h4>
              <p>Wasser als Informationsträger:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Clusterbildung im Wasser</li>
                <li>Molekulare Strukturen und Muster</li>
                <li>Stabilität der Information</li>
                <li>Bedeutung der Potenzierung</li>
              </ul>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Wissenschaftliche Perspektiven:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Aktuelle Wasserforschung</li>
                <li>Quantenphysikalische Modelle</li>
                <li>Experimentelle Nachweise</li>
                <li>Grenzen des Verständnisses</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-mechanisms-5",
        title: "Resonanz mit dem menschlichen Energiesystem",
        content: (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Bioenergetische Interaktion
              </h4>
              <p>Wechselwirkung zwischen Blütenessenzen und Mensch:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Elektromagnetische Felder des Menschen</li>
                <li>Resonanzphänomene</li>
                <li>Energetische Regulation</li>
                <li>Informationsvermittlung auf Zellebene</li>
              </ul>
            </div>
            <div className="bg-violet-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Praktische Bedeutung:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Individuelles Ansprechen</li>
                <li>Zeitfaktor der Wirkung</li>
                <li>Dosierungsprinzipien</li>
                <li>Beobachtung der Reaktionen</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-mechanisms-6",
        title: "Von der Blüte zur Wirkung",
        content: (
          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Wirkungskette</h4>
              <p>Der Weg von der Blüte zur therapeutischen Wirkung:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Energetisches Potenzial der Blüte</li>
                <li>Übertragungsprozess</li>
                <li>Aufnahme im Organismus</li>
                <li>Transformation der Emotionen</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Qualitätsfaktoren:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Reinheit der Ausgangsstoffe</li>
                <li>Herstellungsbedingungen</li>
                <li>Lagerung und Haltbarkeit</li>
                <li>Anwendungsqualität</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "basics-mechanisms-7",
        title: "Wissenschaftliche Perspektiven",
        content: (
          <div className="space-y-4">
            <div className="bg-rose-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Aktuelle Forschung</h4>
              <p>Wissenschaftliche Untersuchungen zur Wirksamkeit:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Klinische Studien</li>
                <li>Biophysikalische Messungen</li>
                <li>Dokumentierte Fallberichte</li>
                <li>Systematische Reviews</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold">Zukünftige Entwicklungen:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Neue Forschungsmethoden</li>
                <li>Integration in die Medizin</li>
                <li>Qualitätssicherung</li>
                <li>Standardisierung</li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    quiz: {
      questions: [
        {
          type: "multiple",
          question: "Welche Faktoren sind bei der Sonnenmethode relevant?",
          options: [
            "Elektromagnetische Strahlung der Sonne",
            "Künstliche UV-Bestrahlung",
            "Strukturierung des Wassers",
            "Mondphasen",
            "Verwendung von Glasgefäßen",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Die Sonnenmethode basiert auf der natürlichen Sonnenstrahlung, der Wasserstrukturierung und der Verwendung von Glasgefäßen.",
        },
        {
          type: "multiple",
          question: "Welche Prinzipien kennzeichnen die Kochmethode?",
          options: [
            "Thermische Energieübertragung",
            "Extraktion ätherischer Bestandteile",
            "Verwendung von Metallgefäßen",
            "30-minütige Kochzeit",
            "Zugabe von Konservierungsmitteln",
          ],
          correctAnswers: [0, 1, 3],
          explanation:
            "Die Kochmethode nutzt thermische Energie zur Extraktion und Übertragung über eine definierte Kochzeit.",
        },
        {
          type: "multiple",
          question: "Wie funktioniert Wasser als Informationsträger?",
          options: [
            "Bildung von Wasserclustern",
            "Chemische Bindung mit Wirkstoffen",
            "Speicherung von Schwingungsmustern",
            "Radioaktive Markierung",
            "Molekulare Strukturbildung",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Wasser speichert Information durch Clusterbildung, Schwingungsmuster und molekulare Strukturen.",
        },
        {
          type: "single",
          question: "Was ist das zentrale Prinzip der Resonanzwirkung?",
          options: [
            "Chemische Reaktion",
            "Schwingungsabgleich zwischen Essenz und Organismus",
            "Hormonelle Steuerung",
            "Enzymatische Prozesse",
          ],
          correctAnswer: 1,
          explanation:
            "Die Resonanzwirkung basiert auf dem Schwingungsabgleich zwischen Essenz und menschlichem Energiesystem.",
        },
        {
          type: "multiple",
          question:
            "Welche Qualitätsfaktoren sind bei der Herstellung wichtig?",
          options: [
            "Reinheit der Ausgangsstoffe",
            "Industrielle Massenproduktion",
            "Standardisierte Herstellungsbedingungen",
            "Synthetische Zusätze",
            "Korrekte Lagerung",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Qualität wird durch reine Ausgangsstoffe, standardisierte Herstellung und korrekte Lagerung gesichert.",
        },
        {
          type: "multiple",
          question: "Welche wissenschaftlichen Perspektiven sind relevant?",
          options: [
            "Klinische Studien",
            "Alchemistische Traditionen",
            "Biophysikalische Messungen",
            "Astrologische Deutungen",
            "Systematische Reviews",
          ],
          correctAnswers: [0, 2, 4],
          explanation:
            "Wissenschaftliche Relevanz basiert auf klinischen Studien, biophysikalischen Messungen und systematischen Reviews.",
        },
      ] as Question[],
    },
  },
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
