import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/todo/')({
  component: ToDoItem,
});

function ToDoItem() {
  return (
    <>
      <div>Hello "/ToDoItem/"!</div>
      <Link to="/todo/1">ToDo/1</Link>
      <br />
      <Link to="/todo/2">ToDo/2</Link>
      <br />
      <Link to="/todo/3">ToDo/3</Link>
      <br />
      <Link to="/todo/$todoId" params={{ todoId: 4 }}>
        ToDo/4
      </Link>
    </>
  );
}
