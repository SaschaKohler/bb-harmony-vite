export interface Emotion {
  id: string;
  name: string | null;
  color: string | null;
  description: string | null;
}

export interface EmotionGroup {
  description: string;
  examples: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export type EmotionGroupName = keyof typeof EMOTION_GROUPS;
