
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../../db/tasks";

import { publicProcedure, router } from "../init";

export const taskRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().trim().min(1, "The title is mandatory"),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      return createTask(input);
    }),

  getAll: publicProcedure.query(() => {
    return getAllTasks();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => {
      const task = getTaskById(input.id);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }

      return task;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().trim().min(1).optional(),
        description: z.string().optional(),
      }).refine(
        (data) =>
          data.title !== undefined ||
          data.description !== undefined,
        { message: "Provide at least one field to update." }
      )
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;

      const task = updateTask(id, data);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Unable to update: task not found.",
        });
      }

      return task;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ input }) => {
      const deleted = deleteTask(input.id);

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not delete: task not found",
        });
      }

      return { success: true };
    }),
});
