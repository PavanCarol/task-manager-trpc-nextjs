
"use client";

import { useRouter } from "next/navigation";

export function NotFoundDialog() {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-2xl text-red-600">!</span>
            </div>
        </div>

        <h2
          id="dialog-title"
          className="text-xl font-bold text-gray-900"
        >
          Task not found
        </h2>

        <p
          id="dialog-description"
          className="mt-2 text-sm text-gray-600"
        >
          The requested task could not be found.
          It may have been deleted or may no longer exist.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            Return to home page
          </button>
        </div>
      </div>
    </div>
  );
}
