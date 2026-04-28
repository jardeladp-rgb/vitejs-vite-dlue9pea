import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Card({ task, deleteTask }) {
  // Dando superpoderes de arrasto para o Card
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  // Calcula a posição do card enquanto ele está voando pela tela
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100, // Mantém o card acima das outras coisas enquanto arrasta
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={{
        ...style,
        border: '1px solid #ccc', 
        padding: '10px', 
        margin: '10px 0', 
        borderRadius: '5px', 
        backgroundColor: 'white',
        cursor: 'grab' // Mostra o ícone de "mãozinha" do mouse
      }}
      className="card"
      {...listeners} // Ouve os cliques do mouse
      {...attributes} // Adiciona os atributos de acessibilidade
    >
      <p>{task.title}</p>
      
      <div className="card-buttons">
        <button 
          className="btn-del" 
          // O onPointerDown impede que o clique no botão de excluir ative o arrastar sem querer
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={() => deleteTask(task.id)} 
          title="Excluir"
          style={{ cursor: 'pointer' }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}