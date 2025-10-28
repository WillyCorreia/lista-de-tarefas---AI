import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


export const CalendarPage: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const { tasks } = useTasks();

  const completedTasksByDay = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const key = `${completedDate.getFullYear()}-${completedDate.getMonth()}-${completedDate.getDate()}`;
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    return map;
  }, [tasks]);


  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    // Blank days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="p-2 h-24 border-r border-b border-pink-100 dark:border-slate-700"></div>);
    }
    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const key = `${year}-${month}-${day}`;
      const completedCount = completedTasksByDay.get(key);
      
      const dayContainerClasses = `p-2 h-24 border-r border-b border-pink-100 dark:border-slate-700 transition-colors duration-200 hover:bg-pink-50 dark:hover:bg-slate-700/50`;

      days.push(
        <div key={day} className={dayContainerClasses}>
          <div className="flex justify-between items-start">
            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-fuchsia-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
              {day}
            </span>
            {completedCount && completedCount > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {Array.from({ length: completedCount }, (_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {monthNames[month]} {year}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-pink-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 border-t border-l border-pink-100 dark:border-slate-700 rounded-lg overflow-hidden">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600 dark:text-gray-400 border-r border-b border-pink-100 dark:border-slate-700 bg-pink-50 dark:bg-slate-900/50">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarPage;