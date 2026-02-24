import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <div>Hello Index "/"!</div>
      <Link to="/aboutNotLazy">AboutNotLazy</Link>
    </>
  );
}
