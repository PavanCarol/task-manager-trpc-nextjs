# TaskFlow – Task Management Application

A task management application developed with **Next.js 15, React, TypeScript, and tRPC** as part of a Software Engineering technical challenge.

TaskFlow provides a simple and intuitive interface for managing daily activities, allowing users to create, view, edit, and delete tasks.

The project focuses on clean code, type safety, server-side rendering, data validation, and a responsive user experience.

## Features

- **Create Tasks:** Register new tasks with a title and optional description.
- **List Tasks:** Display registered tasks in an organized interface.
- **Edit Tasks:** Update existing task information.
- **Delete Tasks:** Remove tasks from the list.
- **Form Validation:** Validate user input using Zod and React Hook Form.
- **Server-Side Rendering (SSR):** Fetch and render the initial task list on the server.
- **Type-Safe API:** Handle communication between the frontend and backend using tRPC.
- **Data Fetching and Caching:** Manage asynchronous operations with TanStack React Query.
- **Error Handling:** Display feedback for validation errors and unsuccessful operations.
- **Responsive Design:** Provide a consistent experience across different screen sizes.

## Technologies

| Technology | Purpose |
|---|---|
| Next.js 15 | React framework and server-side rendering |
| React | User interface |
| TypeScript | Static typing |
| tRPC | Type-safe API communication |
| TanStack React Query | Data fetching, caching, and mutations |
| Zod | Data validation |
| React Hook Form | Form management |
| Tailwind CSS | Styling and responsive layouts |
| pnpm | Package management |

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── tasks/
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           ├── page.tsx
│   │           └── not-found.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── TaskForm.tsx
│   └── TaskList.tsx
│
├── server/
│   ├── db/
│   │   └── tasks.ts
│   └── trpc/
│       └── routers/
│           └── _app.ts
│
└── trpc/
    └── client.ts
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- pnpm

### Installation

1. Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser:

```text
http://localhost:3000
```

## Architecture and Technical Decisions

### 1. Server-Side Rendering (SSR)

The main page uses Next.js App Router and Server-Side Rendering to retrieve the initial task list before rendering the page.

The server calls the tRPC router directly using `createCaller()` and passes the retrieved tasks to the `TaskList` component as initial data.

This approach allows users to see the initial task list as soon as the page loads while maintaining client-side interactivity.

### 2. Type-Safe API with tRPC

The application uses tRPC to define backend procedures and communicate with the frontend without manually duplicating API types.

The task router provides the following operations:

| Procedure | Description |
|---|---|
| `task.getAll` | Retrieve all registered tasks |
| `task.getById` | Retrieve a task by its ID |
| `task.create` | Create a new task |
| `task.update` | Update an existing task |
| `task.delete` | Delete a task |

### 3. Form Validation

Forms are managed using React Hook Form and validated with Zod.

This combination provides:

- Structured input validation.
- Type-safe form data.
- Clear validation messages.
- Better form state management.

### 4. Data Fetching and Caching

TanStack React Query manages client-side data fetching, caching, and mutations.

After creating, editing, or deleting a task, the task list query is invalidated to ensure that the displayed information stays up to date.

### 5. In-Memory Data Storage

For this challenge, tasks are stored in memory using a simple data structure.

No external database is required to run the application.

**Note:** Since data is stored in memory, tasks are not persisted and may be lost when the server restarts.

This approach keeps the implementation focused on the requested functionality and API integration.

### 6. Error Handling

The application provides feedback for unsuccessful operations and invalid form submissions.

It also handles attempts to access tasks that do not exist, displaying an appropriate not-found page.

## Bonus Features and Future Improvements

The following improvements can extend the application:

- **Infinite Scroll:** Implement incremental task loading as the user scrolls through the list, using paginated tRPC procedures and TanStack React Query's `useInfiniteQuery`.
- **Persistent Storage:** Replace in-memory storage with a database.
- **Automated Tests:** Add unit and integration tests for the main features.
- **Task Filtering:** Allow users to filter and search tasks.
- **Task Priorities:** Add priority levels and task status management.
- **Authentication:** Support individual user accounts and task ownership.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build the application |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run the linter |

## Author

**Carolina Moreira Pavan**

Software Developer | Frontend & Full-Stack Development
