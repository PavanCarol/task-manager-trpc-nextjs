
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
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">
              My tasks
            </h2>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-2xl font-semibold text-blue-700">
              {tasks.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage and organize your activities.
          </p>
        </div>

        <Link
          href="/tasks/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
        >
          <span className="text-lg leading-none">+</span>
          New task
        </Link>
      </div>

      {feedback && (
        <div
          role="status"
          className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <span className="font-bold">✓</span>
          {feedback}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          {isFetching ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="text-sm text-slate-500">
                Loading tasks...
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-8 w-8 text-blue-600"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M8 8h8M8 12h8M8 16h5" />
                </svg>
              </div>

              <h3 className="font-semibold text-slate-900">
                No tasks here
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                You don’t have any tasks registered yet.
                How about creating your first task?
              </p>
              <Link
                href="/tasks/new"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create first task
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="min-w-0 break-words [overflow-wrap:anywhere] text-base font-semibold text-slate-900">
                  {task.title}
                </h3>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="mt-3 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed text-slate-600">
                  {task.description}
                </p>
              )}
              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4 text-slate-400"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 11h18" />
                </svg>
                <span className="text-xs text-slate-400">
                  Created on:{" "}
                  {new Date(task.creationDate).toLocaleString("pt-BR")}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
