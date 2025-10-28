import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task, FilterStatus } from '../types';
import { firestoreService } from '../services/firebase';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  filter: FilterStatus;
  editingTask: Task | null;
  addTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: FilterStatus) => void;
  setEditingTask: (task: Task | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(() => {
    if (!currentUser) return;
    setLoading(true);
    
    const unsubscribe = firestoreService.onSnapshot(
      currentUser.uid,
      (newTasks) => {
        // Ordena as tarefas pela data de criação (descendente) no cliente
        const sortedTasks = newTasks.sort((a, b) => b.createdAt - a.createdAt);
        setTasks(sortedTasks);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    );
    
    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = fetchTasks();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchTasks]);

  const addTask = async (title: string, description: string) => {
    if (!currentUser) throw new Error("User not authenticated");
    setLoading(true);
    try {
      await firestoreService.addTask({
        title,
        description,
        completed: false,
        createdAt: Date.now(),
        userId: currentUser.uid,
      } as Omit<Task, 'id'>);
    } catch (error) {
      console.error("Failed to add task:", error);
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    
    const finalUpdates = { ...updates };

    if (updates.completed === true) {
      finalUpdates.completedAt = Date.now();
    } else if (updates.completed === false) {
      finalUpdates.completedAt = null;
    }
    
    try {
      await firestoreService.updateTask(id, finalUpdates);
    } catch (error) {
      console.error("Failed to update task:", error);
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      await firestoreService.deleteTask(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === FilterStatus.COMPLETED) return task.completed;
    if (filter === FilterStatus.PENDING) return !task.completed;
    return true;
  });

  const value = {
    tasks: filteredTasks,
    loading,
    filter,
    editingTask,
    addTask,
    updateTask,
    deleteTask,
    setFilter,
    setEditingTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};