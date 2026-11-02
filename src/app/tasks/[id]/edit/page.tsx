
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
      (error.code === "NOT_FOUND" ||
        error.code === "BAD_REQUEST")
    ) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Return to tasks
        </Link>

        <h1 className="mb-2 mt-6 text-3xl font-bold text-gray-900">
          Edit task
        </h1>

        <p className="mb-8 text-gray-600">
          Update your task information.
        </p>

        <TaskForm mode="edit" task={task} />
      </div>
    </main>
  );
}