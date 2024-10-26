// types.ts
export interface Blossom {
  id: string;
  number: number;
  name_english: string;
  name_german: string;
  name_latin?: string;
  description?: string;
  affirmation?: string | null;
  color?: string;
  emotion_name?: string | null; // Optional: Zugehörige Emotion
}

export interface Sector {
  color: string;
  group: string;
  blossoms: string[];
  description: string;
}
