
import { appRouter } from "@/server/trpc/routers/_app";
import { TaskList } from "@/components/TaskList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const caller = appRouter.createCaller({});
  const tasks = await caller.task.getAll();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Task Manager
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your tasks in one place.
        </p>

        <div className="mt-8">
          <TaskList initialTasks={tasks} />
        </div>
      </div>
    </main>
  );
}
