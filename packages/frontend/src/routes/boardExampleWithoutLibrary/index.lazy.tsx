import { createLazyFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import {
  type BoardTask,
  type ColumnId,
  moveTaskToColumn,
} from '../../store/boardWithoutLibrary.slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

type BoardColumn = {
  id: ColumnId;
  title: string;
};

const COLUMNS: BoardColumn[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

export const Route = createLazyFileRoute('/boardExampleWithoutLibrary/')({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.boardWithoutLibrary.tasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return COLUMNS.reduce<Record<ColumnId, BoardTask[]>>(
      (acc, col) => {
        acc[col.id] = tasks.filter((task) => task.status === col.id);
        return acc;
      },
      { TODO: [], IN_PROGRESS: [], DONE: [] },
    );
  }, [tasks]);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDrop = (targetStatus: ColumnId) => {
    if (!draggedTaskId) return;
    dispatch(moveTaskToColumn({ taskId: draggedTaskId, status: targetStatus }));
    setDraggedTaskId(null);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between rounded-xl bg-black/25 px-4 py-3 text-white backdrop-blur-sm">
        <h1 className="text-lg font-semibold">Project Board</h1>
        <span className="rounded-md bg-white/15 px-3 py-1 text-xs uppercase tracking-wide">
          Native HTML5 DnD
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {COLUMNS.map((column) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: Native HTML5 DnD drop zone.
          <section
            key={column.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.id)}
            className="flex min-h-[420px] flex-col rounded-xl border border-white/25 bg-black/20 p-3 backdrop-blur-sm"
          >
            <header className="mb-3 flex items-center justify-between px-1 text-white">
              <h2 className="text-sm font-semibold uppercase tracking-wide">{column.title}</h2>
              <span className="rounded bg-white/20 px-2 py-0.5 text-xs">
                {grouped[column.id].length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-3">
              {grouped[column.id].map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={() => setDraggedTaskId(null)}
                  className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
                    <span className="text-[10px] text-slate-500">#{task.id}</span>
                  </div>
                  <p className="text-sm text-slate-600">{task.description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
