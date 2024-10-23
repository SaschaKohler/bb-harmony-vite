// src/components/bachbluten/ColorSelector.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useSpring, animated, config } from "@react-spring/web";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Sector } from "@/lib/bachbluten/types";

interface ColorSelectorProps {
  sectors: Sector[];
  onSectorClick: (sector: Sector) => void;
  activeSector: Sector | null;
}

const ColorCard: React.FC<{
  sector: Sector;
  isActive: boolean;
  onClick: () => void;
  index: number;
}> = ({ sector, isActive, onClick, index }) => {
  const springProps = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    delay: index * 100,
    config: config.gentle,
  });

  const hoverSpring = useSpring({
    scale: isActive ? 1.05 : 1,
    shadow: isActive ? 20 : 0,
    config: { tension: 200, friction: 20 },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <animated.div style={springProps} className="h-full">
            <animated.div
              onClick={onClick}
              style={{
                transform: hoverSpring.scale.to((s) => `scale(${s})`),
                boxShadow: hoverSpring.shadow.to(
                  (s) => `0 ${s / 2}px ${s}px rgba(0,0,0,0.1)`,
                ),
              }}
              className={cn(
                "h-full rounded-lg overflow-hidden cursor-pointer",
                "transition-colors duration-200",
                "border-2",
                isActive ? "border-primary" : "border-transparent",
              )}
            >
              {/* Farbbereich */}
              <div
                className="h-24 w-full"
                style={{ backgroundColor: sector.color }}
              />
              {/* Info-Bereich */}
              <div className="p-3 bg-white">
                <h3 className="font-medium text-sm mb-1">{sector.group}</h3>
                <span className="text-xs text-muted-foreground">
                  {sector.blossoms.length} Blüten
                </span>
              </div>
            </animated.div>
          </animated.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm">{sector.description}</p>
            <div className="text-xs text-muted-foreground">
              {sector.blossoms.join(", ")}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  sectors,
  onSectorClick,
  activeSector,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {sectors.map((sector, index) => (
        <ColorCard
          key={sector.group}
          sector={sector}
          isActive={activeSector?.group === sector.group}
          onClick={() => onSectorClick(sector)}
          index={index}
        />
      ))}
    </div>
  );
};
