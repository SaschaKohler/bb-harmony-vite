import { useContext } from "react";
import { LearningContext } from "../context/learning-hub-context";

export const useLearningContext = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error(
      "useLearningContext must be used within a LearningProvider",
    );
  }
  return context;
};
