export function Card({ task, updateStatus, deleteTask }) {
    return (
      <div className="card">
        <p>{task.title}</p>
        <div className="card-buttons">
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
    );
  }