import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { firebaseAuth } from '../services/firebase';

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
)

export const Sidebar: React.FC = () => {
    const { activePage, setActivePage } = useNavigation();
    const { currentUser } = useAuth();
    
    const handleLogout = async () => {
      try {
        await firebaseAuth.signOut();
      } catch (error) {
        console.error("Failed to log out", error);
      }
    };

    const NavItem: React.FC<{ page: 'tasks' | 'calendar'; children: React.ReactNode }> = ({ page, children }) => {
        const isActive = activePage === page;
        const baseClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200';
        const activeClasses = 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300';
        const inactiveClasses = 'text-gray-600 hover:bg-pink-100 dark:text-gray-300 dark:hover:bg-slate-700';

        return (
            <li onClick={() => setActivePage(page)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                {children}
            </li>
        );
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-800 p-4 flex flex-col shadow-lg flex-shrink-0">
            <div className="flex-shrink-0 mb-8 px-4">
              <h1 className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">Tarefas App</h1>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    <NavItem page="tasks">
                        <TaskIcon />
                        <span className="font-medium">Tarefas</span>
                    </NavItem>
                    <NavItem page="calendar">
                        <CalendarIcon />
                        <span className="font-medium">Calendário</span>
                    </NavItem>
                </ul>
            </nav>
            <div className="mt-auto">
                {currentUser && (
                    <div className="p-3 mb-2 rounded-lg bg-pink-50 dark:bg-slate-700/50">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={currentUser.email ?? ''}>{currentUser.email}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors duration-200"
                >
                    <LogoutIcon />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );
};