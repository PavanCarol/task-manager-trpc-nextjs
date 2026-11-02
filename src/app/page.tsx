
import { appRouter } from "@/server/trpc/routers/_app";
import { TaskList } from "@/components/TaskList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const caller = appRouter.createCaller({});
  const tasks = await caller.task.getAll();

  return (
     <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500"> Manage your tasks in one place.</p>
            </div>
          </div>
           <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-600">
                YOUR PRODUCTIVITY SPACE
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                👋Hello!
              </h2>

              <p className="mt-3 text-slate-500">
                Organize your activities and keep track of your tasks.
              </p>
            </div>
          </div>
        </header>

        <section>
          <TaskList initialTasks={tasks} />
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-400">
            TaskFlow · Simple task management
          </p>
        </footer>

      </div>
    </main>
  );
}
