import { createFileRoute } from '@tanstack/react-router';

type PageParams = {
  page: number;
};
export const Route = createFileRoute('/todo/$todoid')({
  component: RouteComponent,
  validateSearch: (search: PageParams) => {
    return {
      page: Number(search.page),
    };
  },
});

function RouteComponent() {
  const { todoid } = Route.useParams();
  console.log(Route.useRouteContext());
  return <div>Hello todoidParams: {todoid}</div>;
}
