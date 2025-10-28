import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

export const AddTaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addTask, updateTask, loading, editingTask, setEditingTask } = useTasks();

  const isEditing = editingTask !== null;

  useEffect(() => {
    if (isEditing) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;

    if (isEditing) {
      await updateTask(editingTask.id, { title, description });
    } else {
      await addTask(title, description);
    }
    
    setEditingTask(null); // Reseta o formulário para o modo de adição
  };

  const handleCancel = () => {
    setEditingTask(null); // Cancela a edição e limpa o formulário
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {isEditing ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da Tarefa"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da tarefa (opcional)"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:bg-fuchsia-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {loading ? (isEditing ? 'Salvando...' : 'Adicionando...') : (isEditing ? 'Salvar Alterações' : 'Adicionar Tarefa')}
        </button>
        {isEditing && (
            <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150 ease-in-out dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
            >
                Cancelar
            </button>
        )}
      </div>
    </form>
  );
};
