import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express-serve-static-core';
import 'dotenv/config';
import errorHandler from './middleware/errorHandler.middleware';
import documentRouter from './modules/document/document.routes';

const app = express();
const port = process.env.PORT || 3021;

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
  }),
);

app.use('/api/documents', documentRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from PDF Kanban Board Backend!');
});

app.get('/api/test-data', (_req: Request, res: Response) => {
  const mockData = {
    message: 'Ці дані прийшли з бекенду!',
    items: [
      { id: 1, name: 'Завдання 1', status: 'В процесі' },
      { id: 2, name: 'Завдання 2', status: 'Виконано' },
      { id: 3, name: 'Завдання 3', status: 'Очікує' },
    ],
    timestamp: new Date().toISOString(),
  };
  res.json(mockData);
});

app.all('*', (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backender Server is running on http://localhost:${port}`);
});
