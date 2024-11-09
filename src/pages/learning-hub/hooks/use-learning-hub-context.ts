import { useContext } from "react";
import { LearningContext } from "../context/learning-hub-context";

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};
