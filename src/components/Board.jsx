import React from 'react';
import { 
  DndContext, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCorners 
} from '@dnd-kit/core';
import { Column } from './Column';

export function Board({ tasks, updateStatus, deleteTask }) {
  // Configuração de Sensores (Mouse e Toque)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Só começa a arrastar se mover 5 pixels (evita cliques acidentais)
      },
    })
  );

  const columns = [
    { id: 'todo', title: '📋 A Fazer' },
    { id: 'doing', title: '🚧 Fazendo' },
    { id: 'done', title: '✅ Concluído' }
  ];

  // Função disparada quando o usuário SOLTA o card
  function handleDragEnd(event) {
    const { active, over } = event;

    // Se não soltou sobre nada, ignora
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // O ID do destino (será o ID da coluna)

    // Se o status mudou, atualizamos no Supabase
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateStatus(taskId, newStatus);
    }
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragEnd={handleDragEnd}
    >
      <div className="board" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {columns.map(col => (
          <Column 
            key={col.id}
            id={col.id} // Passamos o ID para a coluna ser um alvo
            title={col.title}
            tasks={tasks.filter(t => t.status === col.id)}
            updateStatus={updateStatus}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </DndContext>
  );
}