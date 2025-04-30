export interface Subject {
  $id: string;
  title: string;
  description: string;
  createdAt: string | Date;
  lastOpened?: string | Date;
  userId: string;
}

export interface Chapter {
  $id: string;
  title: string;
  content: string;
  completed: boolean;
  subjectId: string;
  createdAt: string | Date;
  lastStudied?: string | Date;
}

export interface SubjectWithProgress extends Subject {
  completedChapters: number;
  totalChapters: number;
  progressPercentage: number;
  lastOpened: Date;
  createdAt: Date;
  chapters: Chapter[];
}

export type SortOption = "lastOpened" | "alphabetical" | "created" | "progress";
