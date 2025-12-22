// packages/frontend/src/App.tsx
import { useEffect, useState } from 'react';

interface TestData {
  message: string;
  items: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test-data');
        if (!response.ok) {
          throw new Error('Не вдалося отримати дані з сервера');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Сталася невідома помилка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              {loading ? (
                <p className="text-gray-500">Завантаження даних...</p>
              ) : error ? (
                <p className="text-red-500">Помилка: {error}</p>
              ) : data ? (
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
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
