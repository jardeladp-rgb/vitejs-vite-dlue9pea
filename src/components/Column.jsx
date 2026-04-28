import { Card } from './Card';

export function Column({ title, tasks, updateStatus, deleteTask }) {
  return (
    <div className="column">
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