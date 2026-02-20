import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/aboutNotLazy')({
  component: aboutNotLazy,
});

function aboutNotLazy() {
  return <div>Hello aboutNotLazy "/aboutNotLazy"!</div>;
}
