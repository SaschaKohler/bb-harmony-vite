import { useState } from "react";
import { useTherapeuticDialogue } from "../hooks/useTherapeuticDialogue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TherapeuticWizard = () => {
  const [userInput, setUserInput] = useState("");
  const { conversation, isLoading, startDialogue, respondToUser } =
    useTherapeuticDialogue();

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    await respondToUser(userInput, {
      selectedEmotions: [], // Hier die ausgewählten Emotionen einfügen
      currentMood: userInput,
    });

    setUserInput("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bach-Blüten Beratung</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === "assistant"
                  ? "bg-blue-50 text-blue-900"
                  : "bg-gray-50 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Beschreibe, wie du dich fühlst..."
          className="w-full"
          rows={4}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !userInput.trim()}
          className="w-full"
        >
          {isLoading ? "Verarbeite..." : "Antwort senden"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TherapeuticWizard;
