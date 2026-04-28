import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { useBoardStore } from '../store/useBoardStore';
import { Column } from './Column';

export function Board() {
  // O Board pega os dados direto da fonte
  const { tasks, updateTaskStatus } = useBoardStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columns = [
    { id: 'todo', title: '📋 A Fazer' },
    { id: 'doing', title: '🚧 Fazendo' },
    { id: 'done', title: '✅ Concluído' }
  ];

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      updateTaskStatus(active.id, over.id);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="board" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {columns.map(col => (
          <Column 
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter(t => t.status === col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}