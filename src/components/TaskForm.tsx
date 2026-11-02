
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { Task } from "@/server/db/tasks";

const taskSchema = z.object({
  title: z.string().trim().min(1, "The title is mandatory."),
  description: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
}

export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [feedback, setFeedback] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
    },
  });

  const createMutation = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.task.getAll.queryKey(),
        });

        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        setFeedback(error.message);
      },
    })
  );

  const updateMutation = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.task.getAll.queryKey(),
        });

        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        setFeedback(error.message);
      },
    })
  );

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  function onSubmit(data: TaskFormData) {
    setFeedback("");

    if (mode === "create") {
      createMutation.mutate(data);
      return;
    }

    if (!task) {
      setFeedback("Não foi possível identificar a tarefa.");
      return;
    }

    updateMutation.mutate({
      id: task.id,
      ...data,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Title *
        </label>

        <input
          id="title"
          type="text"
          {...register("title")}
          placeholder="Enter the task title"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          {...register("description")}
          placeholder="Describe your task (optional)"
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {feedback && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {feedback}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create task"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}