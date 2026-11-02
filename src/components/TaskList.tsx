
"use client";

import { useState } from "react";
import Link from "next/link";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { Task } from "@/server/db/tasks";

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [feedback, setFeedback] = useState("");

  const {data: tasks = [],isFetching,} = useQuery({
    ...trpc.task.getAll.queryOptions(),
    initialData: initialTasks,
  });

  const deleteMutation = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.task.getAll.queryKey(),
        });

        setFeedback("Tarefa excluída com sucesso!");
      },
      onError: (error) => {
        setFeedback(error.message);
      },
    })
  );

  function handleDelete(id: string) {
    setFeedback("");
    deleteMutation.mutate({ id });
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          My tasks ({tasks.length})
        </h2>

        <Link
          href="/tasks/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + New task
        </Link>
      </div>

      {feedback && (
        <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {feedback}
        </p>
      )}

     {tasks.length === 0 ? (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        {isFetching ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-sm text-gray-500">
              Loading tasks...
            </p>
            </div>
          ) : (
          <p className="text-gray-500">
            You do not have any tasks registered yet.
          </p>
        )}
      </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <article 
            key={task.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="min-w-0 break-words [overflow-wrap:anywhere] font-semibold text-gray-900">
                  {task.title}
                </h3>
              <div className="flex shrink-0 gap-2">
                <Link
                href={`/tasks/${task.id}/edit`}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100"
              >
                Edit
                </Link>
                <button
                type="button"
                onClick={() => handleDelete(task.id)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  Delete
                </button>
                </div>
                </div>
                {task.description && (
                  <p className="mt-3 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-gray-600">
                    {task.description}
                    </p>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  Created on:{" "}
                  {new Date(task.creationDate).toLocaleString("pt-BR")}
                </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
