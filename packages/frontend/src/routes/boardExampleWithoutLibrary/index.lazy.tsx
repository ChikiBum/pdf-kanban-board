import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  addTask,
  archiveSelectedTasks,
  type BoardTask,
  type ColumnId,
  clearTaskSelection,
  moveTaskToColumn,
  removeArchivedTask,
  restoreArchivedTask,
  toggleTaskSelection,
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
  const archivedTasks = useAppSelector((state) => state.boardWithoutLibrary.archivedTasks);
  const selectedTaskIds = useAppSelector((state) => state.boardWithoutLibrary.selectedTaskIds);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    if (isArchiveOpen && archivedTasks.length === 0) {
      setIsArchiveOpen(false);
    }
  }, [isArchiveOpen, archivedTasks.length]);

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

  const handleCreateTask = () => {
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();
    if (!trimmedTitle) return;

    dispatch(
      addTask({
        title: trimmedTitle,
        description: trimmedDescription,
      }),
    );
    setNewTitle('');
    setNewDescription('');
    setIsAddFormOpen(false);
  };

  const handleCancelAdd = () => {
    setIsAddFormOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] p-4 md:p-6">
      <div
        className={`mb-4 flex h-14 items-center justify-between rounded-xl px-4 text-white backdrop-blur-sm ${
          selectedTaskIds.length > 0
            ? 'border border-amber-200/70 bg-amber-50/10 text-amber-900 shadow-md'
            : 'bg-black/25'
        }`}
      >
        {selectedTaskIds.length > 0 ? (
          <>
            <span className="text-sm font-medium">Selected: {selectedTaskIds.length}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => dispatch(clearTaskSelection())}
                className="h-8 bg-white text-xs uppercase tracking-wide"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => dispatch(archiveSelectedTasks())}
                className="h-8 bg-amber-600 text-xs uppercase tracking-wide text-white hover:bg-amber-700"
              >
                Archive
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold">Project Board</h1>
            <div className="flex items-center gap-2">
              {archivedTasks.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsArchiveOpen((prev) => !prev)}
                  className="h-8 bg-white text-xs font-semibold uppercase tracking-wide text-slate-800 hover:bg-slate-100"
                >
                  Archive ({archivedTasks.length})
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => setIsAddFormOpen(true)}
                className="h-8 bg-emerald-500 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-600"
              >
                Add
              </Button>
              <span className="rounded-md bg-white/15 px-3 py-1 text-xs uppercase tracking-wide">
                Native HTML5 DnD
              </span>
            </div>
          </>
        )}
      </div>

      {isArchiveOpen && (
        <div className="mb-4 rounded-xl border border-white/25 bg-black/20 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Archived Cards
            </h2>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setIsArchiveOpen(false)}
              className="h-8 text-xs uppercase tracking-wide"
            >
              Close
            </Button>
          </div>

          {archivedTasks.length === 0 ? (
            <p className="text-sm text-white/80">Archive is empty</p>
          ) : (
            <div className="flex flex-col gap-2">
              {archivedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                    <p className="text-sm text-slate-600">{task.description}</p>
                    <p className="text-[10px] text-slate-500">#{task.id}</p>
                  </div>
                  <div className="ml-3 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => dispatch(restoreArchivedTask(task.id))}
                      className="h-8 text-xs uppercase tracking-wide"
                    >
                      Restore
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => dispatch(removeArchivedTask(task.id))}
                      className="h-8 text-xs uppercase tracking-wide"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAddFormOpen && (
        <div className="mb-4 rounded-xl border border-white/25 bg-black/20 p-4 backdrop-blur-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Add Card
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label htmlFor="task-title" className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-white/85">
                Title
              </span>
              <Input
                id="task-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter title"
                className="border-slate-300 bg-white text-slate-800 focus-visible:ring-emerald-500"
              />
            </label>
            <label htmlFor="task-description" className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-white/85">
                Description
              </span>
              <Input
                id="task-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter description"
                className="border-slate-300 bg-white text-slate-800 focus-visible:ring-emerald-500"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleCreateTask}
              className="h-8 bg-emerald-500 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-600"
              disabled={!newTitle.trim()}
            >
              Create
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleCancelAdd}
              className="h-8 text-xs font-semibold uppercase tracking-wide"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

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
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">#{task.id}</span>
                      <input
                        type="checkbox"
                        checked={selectedTaskIds.includes(task.id)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          dispatch(toggleTaskSelection(task.id));
                        }}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-600"
                        aria-label={`Select task ${task.title}`}
                      />
                    </div>
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
