import React from 'react';
import { useTasks } from '../context/TaskContext';
import { AddTaskForm } from '../components/AddTaskForm';
import { TaskItem } from '../components/TaskItem';
import { FilterTabs } from '../components/FilterTabs';
import { Spinner } from '../components/Spinner';

const HomePage: React.FC = () => {
  const { tasks, loading } = useTasks();

  return (
    <div className="max-w-2xl mx-auto">
      <AddTaskForm />
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
        <FilterTabs />
        {loading && tasks.length === 0 ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            <h3 className="text-xl font-semibold">Nenhuma tarefa ainda!</h3>
            <p>Adicione uma nova tarefa para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;