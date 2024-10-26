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
import type { Sector } from "@/lib/bachblueten/types";

interface HarmonyWheelProps {
  sectors: Sector[];
  onSectorClick: (sector: Sector) => void;
  activeSector: Sector | null;
  className?: string;
}

interface SectorProps {
  sector: Sector;
  index: number;
  totalSectors: number;
  onSectorClick: (sector: Sector) => void;
  isActive: boolean;
}

const WheelSector: React.FC<SectorProps> = ({
  sector,
  index,
  totalSectors,
  onSectorClick,
  isActive,
}) => {
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
            onClick={() => onSectorClick(sector)}
          >
            <animated.div
              className="absolute inset-0 origin-[0%_0%] border border-white/20"
              style={{
                backgroundColor: sector.color,
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
              <h4 className="font-medium text-base">{sector.group}</h4>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {sector.blossoms.length} Blüten
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {sector.description}
            </p>
            <div className="pt-2 border-t border-border">
              <h5 className="text-xs font-medium mb-1 text-muted-foreground">
                Blüten in dieser Gruppe:
              </h5>
              <p className="text-xs text-muted-foreground">
                {sector.blossoms.join(", ")}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const HarmonyWheel: React.FC<HarmonyWheelProps> = ({
  sectors,
  onSectorClick,
  activeSector,
  className,
}) => {
  // Animation für den zentralen Kreis
  const centerSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    delay: 300,
    config: config.gentle,
  });

  return (
    <div className={cn("relative w-[300px] h-[300px]", className)}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-full overflow-hidden bg-white/50 shadow-lg">
          {sectors.map((sector, index) => (
            <WheelSector
              key={sector.group}
              sector={sector}
              index={index}
              totalSectors={sectors.length}
              onSectorClick={onSectorClick}
              isActive={activeSector?.group === sector.group}
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
