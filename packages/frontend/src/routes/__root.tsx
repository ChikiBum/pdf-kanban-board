import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/aboutNotLazy">AboutNotLazy</Link>
        <Link to="/todo">ToDo</Link>
      </header>
      <hr />
      <Outlet />
    </>
  ),
});
