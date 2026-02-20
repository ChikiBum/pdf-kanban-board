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
};

const initialState: BoardWithoutLibraryState = {
  tasks: [
    {
      id: '1',
      title: 'Collect Documents',
      description: 'Get all PDF files from stakeholders',
      status: 'TODO',
    },
    {
      id: '2',
      title: 'Review Requirements',
      description: 'Validate naming and metadata rules',
      status: 'TODO',
    },
    {
      id: '3',
      title: 'Upload to Board',
      description: 'Send files to backend and map to cards',
      status: 'IN_PROGRESS',
    },
    {
      id: '4',
      title: 'Approve Package',
      description: 'Mark ready for signature step',
      status: 'DONE',
    },
  ],
};

const boardWithoutLibrarySlice = createSlice({
  name: 'boardWithoutLibrary',
  initialState,
  reducers: {
    moveTaskToColumn: (state, action: PayloadAction<{ taskId: string; status: ColumnId }>) => {
      const { taskId, status } = action.payload;
      state.tasks = state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task));
    },
  },
});

export const { moveTaskToColumn } = boardWithoutLibrarySlice.actions;
export default boardWithoutLibrarySlice.reducer;
