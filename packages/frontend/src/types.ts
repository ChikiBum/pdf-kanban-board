export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Column = {
  id: TaskStatus;
  title: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
};
