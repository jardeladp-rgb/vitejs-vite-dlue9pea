import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useBoardStore } from './store/useBoardStore'; // Importamos a Store
import { Board } from './components/Board';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [newTask, setNewTask] = useState('');
  
  // Pegamos o que precisamos da Store
  const { fetchTasks, addTask } = useBoardStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Quando a sessão existir, carregamos as tarefas
  useEffect(() => {
    if (session) fetchTasks();
  }, [session, fetchTasks]);

  const handleAddTask = () => {
    if (!newTask) return;
    addTask(newTask, session.user.id);
    setNewTask('');
  };

  if (!session) {
    return (
      <div className="login-screen">
        <h1>🚀 Meu Kanban</h1>
        <button onClick={async () => {
          const email = prompt("E-mail:");
          const password = prompt("Senha:");
          await supabase.auth.signUp({ email, password });
        }}>Entrar / Criar Conta</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h2>Quadro de {session.user.email}</h2>
        <button className="btn-sair" onClick={() => supabase.auth.signOut()}>Sair</button>
      </header>

      <div className="input-group">
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="O que precisa ser feito?" 
        />
        <button className="btn-add" onClick={handleAddTask}>Criar Tarefa</button>
      </div>

      {/* Não passamos NENHUMA prop! O Board se vira sozinho */}
      <Board /> 
    </div>
  );
}