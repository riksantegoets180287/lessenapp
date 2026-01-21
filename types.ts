
export type IconKind = 'lucide' | 'image';

export interface IconData {
  kind: IconKind;
  name?: string; // Lucide icon name
  dataUrl?: string; // Base64 for images
}

export interface Part {
  id: string;
  title: string;
  description?: string;
  learningGoals: string;
  startUrl: string;
  infoUrl?: string;
  icon?: IconData;
  isEnabled: boolean;
  dateAvailable?: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  icon?: IconData;
  learningGoals: string;
  startUrl: string;
  // Added infoUrl to the Lesson interface to support extra documentation links and fix type mismatch in demo data
  infoUrl?: string;
  isEnabled: boolean;
  dateAvailable?: string;
  order: number;
  parts: Part[];
}

export interface Topic {
  id: string;
  title: string;
  icon?: IconData;
  isEnabled: boolean;
  dateAvailable?: string;
  order: number;
  lessons: Lesson[];
}

export interface AppStats {
  totalVisits: number;
  uniqueVisitors: number;
  clicks: {
    topics: Record<string, number>;
    lessons: Record<string, number>;
    parts: Record<string, number>;
  };
}