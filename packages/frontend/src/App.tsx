// packages/frontend/src/App.tsx
import { Suspense } from 'react';
import { getTestData } from './api/testData';
import { Activity } from './components/Activity';
import { ErrorBoundary } from './components/ErrorBoundary';

// Отримуємо дані для Suspense
const testData = getTestData();

// Компонент для відображення даних
function TestDataDisplay() {
  const data = testData.read();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{data.message}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Останнє оновлення: {new Date(data.timestamp).toLocaleString()}
      </p>
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">{item.name}</h3>
            <p
              className={`text-sm ${
                item.status === 'Виконано'
                  ? 'text-green-600'
                  : item.status === 'В процесі'
                    ? 'text-blue-600'
                    : 'text-yellow-600'
              }`}
            >
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент завантаження
function LoadingSpinner() {
  return <p className="text-gray-500">Завантаження даних...</p>;
}

// Компонент помилки
function ErrorFallback({ error }: { error: Error }) {
  return <p className="text-red-500">Помилка: {error.message}</p>;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">PDF Kanban Board</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
              <ErrorBoundary
                fallback={
                  <ErrorFallback error={new Error('Сталася помилка при завантаженні даних')} />
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Activity>
                    <TestDataDisplay />
                  </Activity>
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
