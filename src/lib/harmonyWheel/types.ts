// src/components/HarmonyWheel/types.ts
export interface WheelSegmentProps {
  emotion: EmotionWithFlowers;
  rotation: number;
  isSelected: boolean;
  onSelect: (emotion: EmotionWithFlowers) => void;
}

export interface FlowerListProps {
  flowers: BachFlower[];
  selectedFlower: BachFlower | null;
  onSelectFlower: (flower: BachFlower) => void;
}

export interface FlowerCardProps {
  flower: BachFlower;
  isSelected: boolean;
  onSelect: (flower: BachFlower) => void;
}

export interface DetailViewProps {
  emotion: EmotionWithFlowers;
  selectedFlower: BachFlower | null;
  onSelectFlower: (flower: BachFlower) => void;
  onClose: () => void;
}
