export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  slug?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
  slug?: string;
}

export interface BlogStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  publishingStreak: number;
  lastPublished: Date | null;
}

export interface DayPublishData {
  date: string; // ISO string format
  count: number;
} 