interface TestData {
  message: string;
  items: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  timestamp: string;
}

async function fetchTestData(): Promise<TestData> {
  const response = await fetch('/api/test-data');
  if (!response.ok) {
    throw new Error('Не вдалося отримати дані з сервера');
  }
  return response.json();
}

function wrapPromise<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T | Error;

  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    },
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else {
        return result as T;
      }
    },
  };
}

export function getTestData() {
  return wrapPromise(fetchTestData());
}
