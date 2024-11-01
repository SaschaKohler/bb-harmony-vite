// src/components/bachbluten/HarmonyWheel.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useSpring, animated, config } from "@react-spring/web";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHarmonyWheel } from "@/hooks/useHarmonyWheel";
import type { Database } from "@/types/supabase";

type Emotion = Database["public"]["Tables"]["emotion"]["Row"];
type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

interface EmotionWithFlowers extends Emotion {
  bach_flowers: BachFlower[];
}

interface WheelSectorProps {
  emotion: EmotionWithFlowers;
  index: number;
  totalSectors: number;
  onSectorClick: (emotion: EmotionWithFlowers) => void;
  isActive: boolean;
}

const WheelSector: React.FC<WheelSectorProps> = ({
  emotion,
  index,
  totalSectors,
  onSectorClick,
  isActive,
}) => {
  console.log("WheelSector render:", {
    emotionName: emotion.name,
    hasClickHandler: !!onSectorClick,
  }); // Debug log

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sector clicked, emotion:", emotion); // Verbessertes Logging
    onSectorClick(emotion); // Direkt das emotion Objekt übergeben
  };

  const angle = (index * 360) / totalSectors;
  const skew = 90 - 360 / totalSectors;

  // Animation für den Sektor
  const springProps = useSpring({
    scale: isActive ? 0.99 : 0.98,
    opacity: isActive ? 1 : 0.8,
    brightness: isActive ? 1.1 : 1,
    shadow: isActive ? 0.2 : 0,
    config: { ...config.gentle, tension: 200, friction: 20 },
  });

  // Rotation Animation beim ersten Rendern
  const initialRotation = useSpring({
    from: { rotate: -180 },
    to: { rotate: 0 },
    delay: index * 100,
    config: { ...config.gentle, tension: 120, friction: 14 },
  });

  const getTooltipSide = () => {
    if (angle > 45 && angle < 135) return "bottom";
    if (angle > 225 && angle < 315) return "top";
    return angle <= 180 ? "right" : "left";
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <animated.div
            className={cn(
              "absolute w-1/2 h-1/2",
              "left-1/2 top-1/2",
              "cursor-pointer",
              "origin-[0%_0%]",
            )}
            style={{
              transform: initialRotation.rotate.to(
                (r) => `rotate(${angle + r}deg) skew(${skew}deg)`,
              ),
            }}
            onClick={handleClick}
          >
            <animated.div
              className="absolute inset-0 origin-[0%_0%] border border-white/20"
              style={{
                backgroundColor: emotion.color || "#gray",
                scale: springProps.scale,
                opacity: springProps.opacity,
                filter: springProps.brightness.to((b) => `brightness(${b})`),
                boxShadow: springProps.shadow.to(
                  (s) => `inset 0 0 ${s * 20}px rgba(255,255,255,${s})`,
                ),
              }}
            />
          </animated.div>
        </TooltipTrigger>
        <TooltipContent
          side={getTooltipSide()}
          className="max-w-[280px] p-3"
          sideOffset={5}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">{emotion.name}</h4>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {emotion.bach_flowers.length} Blüten
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {emotion.description}
            </p>
            <div className="pt-2 border-t border-border">
              <h5 className="text-xs font-medium mb-1 text-muted-foreground">
                Blüten in dieser Gruppe:
              </h5>
              <p className="text-xs text-muted-foreground">
                {emotion.bach_flowers
                  .map((flower) => flower.name_german || flower.name_english)
                  .join(", ")}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface HarmonyWheelProps {
  className?: string;
  onSectorClick: (emotion: EmotionWithFlowers | null) => void; // Neue Prop
}

export const HarmonyWheel: React.FC<HarmonyWheelProps> = ({
  className,
  onSectorClick,
}) => {
  const { emotions, loading, error, selectedEmotion, selectEmotion } =
    useHarmonyWheel();
  console.log("HarmonyWheel render:", {
    emotionsCount: emotions.length,
    hasSelectEmotion: !!selectEmotion,
  }); // Debug Log
  const handleSectorClick = (emotion: EmotionWithFlowers) => {
    onSectorClick(emotion);
  };
  // Animation für den zentralen Kreis
  const centerSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    delay: 300,
    config: config.gentle,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center w-[300px] h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-[300px] h-[300px] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-[300px] h-[300px]", className)}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-full overflow-hidden bg-white/50 shadow-lg">
          {emotions.map((emotion, index) => (
            <WheelSector
              key={emotion.id}
              emotion={emotion}
              index={index}
              totalSectors={emotions.length}
              onSectorClick={handleSectorClick}
              isActive={selectedEmotion?.id === emotion.id}
            />
          ))}
        </div>

        {/* Animiertes Zentrum */}
        <animated.div
          className="absolute left-1/2 top-1/2 z-10"
          style={{
            transform: centerSpring.scale.to(
              (s) => `translate(-50%, -50%) scale(${s})`,
            ),
            rotateZ: centerSpring.rotate,
          }}
        >
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-md border border-gray-100">
            <span className="text-primary font-satisfy text-lg">Harmonie</span>
          </div>
        </animated.div>
      </div>
    </div>
  );
};
