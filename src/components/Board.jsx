import { Column } from './Column';

export function Board({ tasks, updateStatus, deleteTask }) {
  // Configuração limpa das nossas colunas
  const columns = [
    { id: 'todo', title: '📋 A Fazer' },
    { id: 'doing', title: '🚧 Fazendo' },
    { id: 'done', title: '✅ Concluído' }
  ];

  return (
    <div className="board">
      {columns.map(col => (
        <Column 
          key={col.id}
          title={col.title}
          tasks={tasks.filter(t => t.status === col.id)}
          updateStatus={updateStatus}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}