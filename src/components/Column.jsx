import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from './Card';

export function Column({ id, title, tasks, updateStatus, deleteTask }) {
  // Configurando esta coluna como uma "Zona de Pouso"
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className="column"
      style={{ 
        background: isOver ? '#e2e8f0' : '#f4f5f7', // Fica mais escuro se o mouse estiver em cima
        padding: '10px', 
        borderRadius: '8px', 
        width: '300px', 
        minHeight: '400px',
        transition: 'background-color 0.2s ease'
      }}
    >
      <h3>{title}</h3>
      {tasks.map(task => (
        <Card 
          key={task.id} 
          task={task} 
          updateStatus={updateStatus} 
          deleteTask={deleteTask} 
        />
      ))}
    </div>
  );
}