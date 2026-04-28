import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useBoardStore = create((set, get) => ({
  // Aqui ficam guardadas as nossas tarefas (o Estado Global)
  tasks: [],

  // 1. Busca inicial
  fetchTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) set({ tasks: data });
  },

  // 2. Adicionar Tarefa
  addTask: async (title, userId) => {
    const { error } = await supabase
      .from('tasks')
      .insert([{ title, user_id: userId, status: 'todo' }]);
    
    if (!error) {
      get().fetchTasks(); // Recarrega para pegar o ID real gerado pelo banco
    }
  },

  // 3. Mover Tarefa (A Mágica Otimista!)
  updateTaskStatus: async (id, newStatus) => {
    // A. Guardamos a lista antiga como "backup" caso a internet caia
    const backupTasks = get().tasks;

    // B. MUDANÇA OTIMISTA: Atualizamos a tela na mesma hora, sem esperar o banco!
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      ),
    }));

    // C. Avisamos o banco em silêncio no fundo...
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    // D. Se der erro (ex: sem internet), fazemos um "Rollback" (puxamos o backup)
    if (error) {
      console.error("Erro ao sincronizar. Revertendo...", error);
      set({ tasks: backupTasks });
      alert("Sua internet falhou. O card voltou para o lugar.");
    }
  },

  // 4. Deletar Tarefa (Otimista também)
  deleteTask: async (id) => {
    const backupTasks = get().tasks;

    // Some com o card da tela instantaneamente
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }));

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      set({ tasks: backupTasks });
      alert("Erro ao deletar tarefa.");
    }
  }
}));