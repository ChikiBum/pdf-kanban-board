import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ColumnId = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type BoardTask = {
  id: string;
  title: string;
  description: string;
  status: ColumnId;
};

type BoardWithoutLibraryState = {
  tasks: BoardTask[];
  archivedTasks: BoardTask[];
  selectedTaskIds: string[];
};

const initialState: BoardWithoutLibraryState = {
  tasks: [],
  archivedTasks: [],
  selectedTaskIds: [],
};

const boardWithoutLibrarySlice = createSlice({
  name: 'boardWithoutLibrary',
  initialState,
  reducers: {
    setBoardData: (
      state,
      action: PayloadAction<{ tasks: BoardTask[]; archivedTasks: BoardTask[] }>,
    ) => {
      state.tasks = action.payload.tasks;
      state.archivedTasks = action.payload.archivedTasks;
      state.selectedTaskIds = [];
    },
    addTask: (state, action: PayloadAction<{ title: string; description: string }>) => {
      const nextId = (
        state.tasks.reduce((max, task) => {
          const numericId = Number.parseInt(task.id, 10);
          return Number.isNaN(numericId) ? max : Math.max(max, numericId);
        }, 0) + 1
      ).toString();

      state.tasks.push({
        id: nextId,
        title: action.payload.title,
        description: action.payload.description,
        status: 'TODO',
      });
    },
    moveTaskToColumn: (state, action: PayloadAction<{ taskId: string; status: ColumnId }>) => {
      const { taskId, status } = action.payload;
      state.tasks = state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task));
    },
    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const isSelected = state.selectedTaskIds.includes(taskId);

      if (isSelected) {
        state.selectedTaskIds = state.selectedTaskIds.filter((id) => id !== taskId);
        return;
      }

      state.selectedTaskIds.push(taskId);
    },
    clearTaskSelection: (state) => {
      state.selectedTaskIds = [];
    },
    archiveSelectedTasks: (state) => {
      if (state.selectedTaskIds.length === 0) return;

      const selectedSet = new Set(state.selectedTaskIds);
      const toArchive = state.tasks.filter((task) => selectedSet.has(task.id));
      state.archivedTasks.push(...toArchive);
      state.tasks = state.tasks.filter((task) => !state.selectedTaskIds.includes(task.id));
      state.selectedTaskIds = [];
    },
    restoreArchivedTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.archivedTasks.find((item) => item.id === taskId);
      if (!task) return;

      state.archivedTasks = state.archivedTasks.filter((item) => item.id !== taskId);
      state.tasks.unshift({ ...task, status: 'TODO' });
    },
    removeArchivedTask: (state, action: PayloadAction<string>) => {
      state.archivedTasks = state.archivedTasks.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setBoardData,
  addTask,
  moveTaskToColumn,
  toggleTaskSelection,
  clearTaskSelection,
  archiveSelectedTasks,
  restoreArchivedTask,
  removeArchivedTask,
} = boardWithoutLibrarySlice.actions;
export default boardWithoutLibrarySlice.reducer;
