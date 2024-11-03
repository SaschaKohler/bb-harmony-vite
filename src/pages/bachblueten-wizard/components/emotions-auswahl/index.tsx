// src/pages/bachblueten-wizard/components/emotions-auswahl/index.tsx

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { EMOTION_GROUPS } from "../../constants/emotion-groups";
export const EmotionsAuswahl: React.FC = () => {
  const { selectedEmotionGroups, selectEmotionGroup, deselectEmotionGroup } =
    useWizardContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          In welchen Bereichen möchtest du Unterstützung?
        </h2>
        <p className="text-gray-700">
          Wähle die Gefühlsbereiche aus, die dich aktuell am meisten
          beschäftigen. Im nächsten Schritt kannst du dann genauer
          spezifizieren.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(EMOTION_GROUPS).map(([groupName, groupInfo]) => (
          <Card
            key={groupName}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200",
              "border-2",
              selectedEmotionGroups.includes(groupName)
                ? "border-[#color] bg-[#bgColor]"
                : "border-transparent hover:border-[#borderColor]/30",
            )}
            style={
              {
                "--color": groupInfo.borderColor,
                "--bgColor": groupInfo.bgColor,
                "--borderColor": groupInfo.borderColor,
              } as React.CSSProperties
            }
            onClick={() => {
              selectedEmotionGroups.includes(groupName)
                ? deselectEmotionGroup(groupName)
                : selectEmotionGroup(groupName);
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {groupName}
                </h3>
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    backgroundColor: groupInfo.color,
                    borderColor: groupInfo.borderColor,
                  }}
                />
              </div>

              <p className="text-sm text-gray-700">{groupInfo.description}</p>

              <div className="flex flex-wrap gap-2">
                {groupInfo.examples.map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="text-xs font-medium"
                    style={{
                      backgroundColor: `${groupInfo.bgColor}`,
                      borderColor: groupInfo.borderColor,
                      color: groupInfo.textColor,
                    }}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedEmotionGroups.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Ausgewählte Bereiche:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedEmotionGroups.map((groupName) => {
              const groupInfo = EMOTION_GROUPS[groupName];
              return (
                <Badge
                  key={groupName}
                  className="px-3 py-1"
                  style={{
                    backgroundColor: groupInfo.bgColor,
                    borderColor: groupInfo.borderColor,
                    color: groupInfo.textColor,
                  }}
                >
                  {groupName}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
