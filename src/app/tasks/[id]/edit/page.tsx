
import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { TaskForm } from "@/components/TaskForm";
import { appRouter } from "@/server/trpc/routers/_app";

export const dynamic = "force-dynamic";

interface EditTaskPageProps {
  params: Promise<{ 
    id: string;
   }>;
}

export default async function EditTaskPage({
  params,
}: EditTaskPageProps) {
  const { id } = await params;

  const caller = appRouter.createCaller({});

  let task;

  try {
    task = await caller.task.getById({ id });
  } catch (error) {
    if (
      error instanceof TRPCError &&
      error.code === "NOT_FOUND"
    ) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <span aria-hidden="true">←</span>
          Back to tasks
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path d="m16 4 4 4M4 20l4-.8L19 8a2.12 2.12 0 0 0-3-3L5 16l-1 4Z" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold tracking-widest text-blue-600">
            TASK MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Edit task
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            Update your task information and keep everything up to date.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Task information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Make the changes you need below.
            </p>
          </div>

          <TaskForm mode="edit" task={task} />
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          TaskFlow · Organize your day, one task at a time.
        </p>
      </div>
    </main>
  );
}