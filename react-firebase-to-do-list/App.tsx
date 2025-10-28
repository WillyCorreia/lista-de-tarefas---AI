import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import { Sidebar } from './components/Sidebar';
import { Spinner } from './components/Spinner';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50 dark:bg-slate-900">
        <Spinner />
      </div>
    );
  }

  return currentUser ? (
    <NavigationProvider>
      <TaskProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <AuthenticatedApp />
        </div>
      </TaskProvider>
    </NavigationProvider>
  ) : (
    <LoginPage />
  );
};

const AuthenticatedApp: React.FC = () => {
  const { activePage } = useNavigation();

  return (
    <Layout>
      {activePage === 'tasks' && <HomePage />}
      {activePage === 'calendar' && <CalendarPage />}
    </Layout>
  );
};


export default App;