import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="p-4">
      <header className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/aboutNotLazy">AboutNotLazy</Link>
        <Link to="/todoExample">ToDo</Link>
        <Link to="/boardExample">Board</Link>
      </header>
      <hr className="my-4" />
      <Outlet />
    </div>
  ),
});
