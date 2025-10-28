// FIX: Removed self-import of User which was causing a conflict.
export interface User {
  uid: string;
  email: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number; // Using timestamp for simplicity
  userId: string;
  completedAt?: number | null; // Timestamp of completion
}

export enum FilterStatus {
  ALL = 'Todas',
  PENDING = 'Pendentes',
  COMPLETED = 'Concluídas',
}