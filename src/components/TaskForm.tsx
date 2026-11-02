
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
      setFeedback("It was not possible to identify the task.");
      return;
    }

    updateMutation.mutate({
      id: task.id,
      ...data,
    });
  }

  const isEditing = mode === "edit";

  return (
    <form 
    onSubmit={handleSubmit(onSubmit)} 
    className="space-y-7">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Title <span className="text-red-500">*</span>
        </label>

        <input
          id="title"
          type="text"
          {...register("title")}
          placeholder="e.g. Complete project documentation"
          className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            errors.title
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        {errors.title && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
            <span>!</span>
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700"
          >
            Description
          </label>
          <span className="text-xs text-slate-400">Optional</span>
        </div>

        <textarea
          id="description"
          {...register("description")}
          placeholder="Add more details about this task..."
          rows={5}
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <p className="mt-2 text-xs text-slate-400">
          Provide additional information to help you remember what needs to be done.
        </p>
      </div>

      {feedback && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="font-bold">!</span>
          <p>{feedback}</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              {isEditing ? "Save changes" : "Create task"}
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}