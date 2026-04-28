import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from './Card';

export function Column({ id, title, tasks }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className="column"
      style={{ 
        background: isOver ? '#e2e8f0' : '#f4f5f7', 
        padding: '10px', borderRadius: '8px', width: '300px', minHeight: '400px'
      }}
    >
      <h3>{title}</h3>
      {tasks.map(task => <Card key={task.id} task={task} />)}
    </div>
  );
}