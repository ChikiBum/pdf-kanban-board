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
    color: isOver ? 'green' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4"
    >
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      {tasks.map((task) => {
        return <TaskCard key={task.id} task={task} />;
      })}
      <div className="flex flex-1 flex-col gap-4"></div>
    </div>
  );
};
