import { createFileRoute } from '@tanstack/react-router';

type PageParams = {
  page: number;
};

const getToDo = async (id: string): Promise<{ title: string }> => {
  const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  console.log('data: ', data);
  // const todo = await data.json();
  // throw new Error('Something went wrong!');
  return data.json();
};

export const Route = createFileRoute('/todoExample/$todoid')({
  component: RouteComponent,
  loader: ({ params }) => getToDo(params.todoid),
  validateSearch: (search: Record<string, unknown>): PageParams => {
    return {
      page: Number(search?.page ?? 1),
    };
  },
  errorComponent: () => <div>Something went wrong! Error Component rendered</div>,
});

function RouteComponent() {
  const { todoid } = Route.useParams();
  const { page } = Route.useSearch();
  const data = Route.useLoaderData();
  console.log('search: ', page);
  console.log('data: ', data);

  return (
    <div>
      Hello todoidParams: {todoid}, page: {page}, title: {data.title}
    </div>
  );
}
