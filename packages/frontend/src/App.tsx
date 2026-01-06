import { Button } from './components/ui/button';

function App() {
  return (
    <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      {' '}
      <Button className="mx-auto rounded-xl outline outline-black/5 dark:outline-white/10 shadow-lg p-16  ">
        test
      </Button>
    </div>
  );
}

export default App;
