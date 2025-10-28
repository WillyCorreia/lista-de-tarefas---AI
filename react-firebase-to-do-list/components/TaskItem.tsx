import React from 'react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, loading, setEditingTask } = useTasks();

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleDelete = () => {
    // A confirmação foi removida para uma exclusão mais simples e direta.
    deleteTask(task.id);
  };

  const handleEdit = () => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`p-4 rounded-lg shadow-md transition-colors duration-200 ${task.completed ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-white dark:bg-slate-800'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer"
            disabled={loading}
          />
          <div className="flex-1">
            <p className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
            {task.completed && task.completedAt && (
              <p className="mt-2 text-xs text-green-700 dark:text-green-400 font-medium">
                Finalizada em: {formatTimestamp(task.completedAt)}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button onClick={handleEdit} className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 disabled:text-gray-400" disabled={loading}>
            Editar
          </button>
          <button onClick={handleDelete} className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 disabled:text-gray-400" disabled={loading}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};