import React from "react";
import { Book, Brain, FlaskConical, Leaf } from "lucide-react";
import { Module } from "../types";

export const getIcon = (type: string) => {
  switch (type) {
    case "book":
      return () => React.createElement(Book, { className: "w-6 h-6" });
    case "brain":
      return () => React.createElement(Brain, { className: "w-6 h-6" });
    case "flask":
      return () => React.createElement(FlaskConical, { className: "w-6 h-6" });
    case "leaf":
      return () => React.createElement(Leaf, { className: "w-6 h-6" });
    default:
      return () => React.createElement(Book, { className: "w-6 h-6" });
  }
};

export const modules: Module[] = [
  {
    id: "basics",
    title: "Grundlagen",
    description: "Einführung in die Bach-Blütentherapie",
    icon: "book",
    lessons: [
      {
        id: "basics-1",
        moduleId: "basics",
        title: "Geschichte",
        content: "",
        status: "available",
        progress: 0,
      },
      {
        id: "basics-2",
        moduleId: "basics",
        title: "Philosophie",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "basics-3",
        moduleId: "basics",
        title: "Wirkungsprinzipien",
        content: "",
        status: "locked",
        progress: 0,
      },
    ],
  },
  {
    id: "emotions",
    title: "Emotionale Zuordnung",
    description: "Verstehen der emotionalen Muster",
    icon: "brain",
    lessons: [
      {
        id: "emotions-1",
        moduleId: "emotions",
        title: "Emotionsgruppen",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "emotions-2",
        moduleId: "emotions",
        title: "Symptomerkennung",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "emotions-3",
        moduleId: "emotions",
        title: "Fallbeispiele",
        content: "",
        status: "locked",
        progress: 0,
      },
    ],
  },
  {
    id: "practice",
    title: "Praktische Anwendung",
    description: "Von der Diagnose zur Behandlung",
    icon: "flask",
    lessons: [
      {
        id: "practice-1",
        moduleId: "practice",
        title: "Beratungsgespräch",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "practice-2",
        moduleId: "practice",
        title: "Dosierung",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "practice-3",
        moduleId: "practice",
        title: "Dokumentation",
        content: "",
        status: "locked",
        progress: 0,
      },
    ],
  },
  {
    id: "advanced",
    title: "Fortgeschrittene Konzepte",
    description: "Tieferes Verständnis und Spezialisierung",
    icon: "leaf",
    lessons: [
      {
        id: "advanced-1",
        moduleId: "advanced",
        title: "Kombinationen",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "advanced-2",
        moduleId: "advanced",
        title: "Langzeitbehandlung",
        content: "",
        status: "locked",
        progress: 0,
      },
      {
        id: "advanced-3",
        moduleId: "advanced",
        title: "Spezialfälle",
        content: "",
        status: "locked",
        progress: 0,
      },
    ],
  },
  // Weitere Module...
];
