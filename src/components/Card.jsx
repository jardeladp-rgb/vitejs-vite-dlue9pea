import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useBoardStore } from '../store/useBoardStore';

export function Card({ task }) {
  const { deleteTask } = useBoardStore(); // Puxa a função de deletar
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={{ ...style, border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: 'white', cursor: 'grab' }}
      {...listeners} 
      {...attributes}
    >
      <p>{task.title}</p>
      <div className="card-buttons">
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={() => deleteTask(task.id)}
          style={{ cursor: 'pointer', border: 'none', background: 'none' }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}