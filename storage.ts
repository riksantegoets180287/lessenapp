
import { Topic } from './types';

const CONTENT_KEY = 'lesmateriaal_content_v1';

const demoData: Topic[] = [
  {
    id: 't1',
    title: 'Basisvaardigheden',
    isEnabled: true,
    order: 1,
    icon: { kind: 'lucide', name: 'BookOpen' },
    lessons: [
      {
        id: 'l1',
        title: 'Word Documenten',
        isEnabled: true,
        order: 1,
        learningGoals: 'Leer hoe je een brief schrijft en opmaakt in Word.',
        startUrl: 'https://office.com',
        infoUrl: 'https://support.microsoft.com/word',
        icon: { kind: 'lucide', name: 'NotebookText' },
        parts: [
          {
            id: 'p1',
            title: 'Brief Indeling',
            description: 'De standaard opbouw van een zakelijke brief.',
            learningGoals: 'Een zakelijke brief bestaat uit: Afzender, Datum, Geadresseerde, Onderwerp, Aanhef, Kern, Slot, Ondertekening.',
            startUrl: 'https://support.microsoft.com',
            isEnabled: true,
            order: 1,
            icon: { kind: 'lucide', name: 'ListChecks' }
          },
          {
            id: 'p2',
            title: 'Opmaak Oefening',
            description: 'Oefen met vette tekst en koppen.',
            learningGoals: 'In dit onderdeel leer je koppen (H1, H2) en dikgedrukte tekst gebruiken.',
            startUrl: 'https://google.com',
            isEnabled: true,
            order: 2,
            icon: { kind: 'lucide', name: 'PlayCircle' }
          }
        ]
      }
    ]
  },
  {
    id: 't2',
    title: 'Digitale Veiligheid',
    isEnabled: false,
    dateAvailable: '2025-09-01',
    order: 2,
    icon: { kind: 'lucide', name: 'Shield' },
    lessons: []
  }
];

export const loadContent = (): Topic[] => {
  const stored = localStorage.getItem(CONTENT_KEY);
  if (!stored) {
    saveContent(demoData);
    return demoData;
  }
  return JSON.parse(stored);
};

export const saveContent = (content: Topic[]) => {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
};
