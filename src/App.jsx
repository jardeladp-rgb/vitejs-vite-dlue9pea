import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // 1. Gerencia o Login
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Busca as tarefas no banco
  useEffect(() => {
    if (session) fetchTasks();
  }, [session]);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setTasks(data);
  }

  // 3. Adiciona nova tarefa
  async function addTask() {
    if (!newTask) return;
    const { error } = await supabase
      .from('tasks')
      .insert([{ title: newTask, user_id: session.user.id, status: 'todo' }]);
    if (!error) {
      setNewTask('');
      fetchTasks();
    }
  }

  // 4. Move a tarefa para QUALQUER coluna (Movimentação Livre)
  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) fetchTasks();
    else alert("Erro ao mover: " + error.message);
  }

  // 5. Deleta a tarefa
  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) fetchTasks();
    else alert("Erro ao deletar: Verifique se você rodou o SQL da lixeira no Supabase.");
  }

  const handleLogin = async () => {
    const email = prompt("E-mail:");
    const password = prompt("Senha:");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  };

  // TELA DE LOGIN
  if (!session) {
    return (
      <div className="login-screen">
        <h1>🚀 Meu Kanban</h1>
        <button onClick={handleLogin}>Entrar / Criar Conta</button>
      </div>
    );
  }

  // TELA DO KANBAN (A que você vê após o login)
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
        <button className="btn-add" onClick={addTask}>Criar Tarefa</button>
      </div>

      <div className="board">
        {['todo', 'doing', 'done'].map(status => (
          <div key={status} className="column">
            <h3>{status === 'todo' ? '📋 A Fazer' : status === 'doing' ? '🚧 Fazendo' : '✅ Concluído'}</h3>
            
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className="card">
                <p>{task.title}</p>
                <div className="card-buttons">
                  {/* Botões de movimentação baseados no status atual */}
                  {task.status !== 'todo' && (
                    <button onClick={() => updateStatus(task.id, 'todo')} title="Mover para A Fazer">⬅️</button>
                  )}
                  {task.status !== 'doing' && (
                    <button onClick={() => updateStatus(task.id, 'doing')} title="Mover para Fazendo">🚧</button>
                  )}
                  {task.status !== 'done' && (
                    <button onClick={() => updateStatus(task.id, 'done')} title="Mover para Concluído">✅</button>
                  )}
                  <button className="btn-del" onClick={() => deleteTask(task.id)} title="Excluir">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}