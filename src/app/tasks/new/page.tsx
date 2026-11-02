
import Link from "next/link";
import { TaskForm } from "@/components/TaskForm";

export default function NewTaskPage() {
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
          New task
        </h1>

        <p className="mb-8 text-gray-600">
          Fill in the fields below to register a new task.
        </p>
        <TaskForm mode="create" />
      </div>
    </main>
  );
}