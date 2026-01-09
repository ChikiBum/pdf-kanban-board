import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/todoExample/')({
  component: ToDoItem,
});

function ToDoItem() {
  return (
    <>
      <div>Hello "/ToDoItem/"!</div>
      <Link to="/todoExample/1">ToDo/1</Link>
      <br />
      <Link to="/todoExample/2">ToDo/2</Link>
      <br />
      <Link to="/todoExample/3">ToDo/3</Link>
      <br />
      <Link to="/todoExample/$todoId" params={{ todoId: 4 }}>
        ToDo/4
      </Link>
    </>
  );
}
