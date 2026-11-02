
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
        titulo: z.string().trim().min(1, "O título é obrigatório"),
        descricao: z.string().optional(),
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
          message: "Tarefa não encontrada.",
        });
      }

      return task;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        titulo: z.string().trim().min(1).optional(),
        descricao: z.string().optional(),
      }).refine(
        (data) =>
          data.titulo !== undefined ||
          data.descricao !== undefined,
        { message: "Informe pelo menos um campo para atualizar." }
      )
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;

      const task = updateTask(id, data);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não foi possível atualizar: tarefa não encontrada.",
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
          message: "Não foi possível excluir: tarefa não encontrada.",
        });
      }

      return { success: true };
    }),
});
