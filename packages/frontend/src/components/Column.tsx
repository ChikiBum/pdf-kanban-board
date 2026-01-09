import { useDroppable } from '@dnd-kit/core';
import type { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
};

export const Column = ({ column, tasks }: ColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });
  const style = {
    border: isOver ? '3px solid blue' : undefined,
    backgroundColor: isOver ? 'rgba(29, 66, 117, 0.9)' : undefined,
    transition: 'all 0.2s ease',
  };

  return (
    <div style={style} className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
};
