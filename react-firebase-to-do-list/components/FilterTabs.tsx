import React from 'react';
import { useTasks } from '../context/TaskContext';
import { FilterStatus } from '../types';

export const FilterTabs: React.FC = () => {
  const { filter, setFilter } = useTasks();
  const filters: FilterStatus[] = [FilterStatus.ALL, FilterStatus.PENDING, FilterStatus.COMPLETED];

  const getButtonClass = (f: FilterStatus) => {
    const baseClass = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 dark:focus:ring-offset-slate-800 transition-colors duration-150";
    if (f === filter) {
      return `${baseClass} bg-fuchsia-600 text-white`;
    }
    return `${baseClass} bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600`;
  };

  return (
    <div className="mb-4 flex justify-center space-x-2 p-2 bg-pink-100 dark:bg-slate-800 rounded-lg">
      {filters.map((f) => (
        <button key={f} onClick={() => setFilter(f)} className={getButtonClass(f)}>
          {f}
        </button>
      ))}
    </div>
  );
};
