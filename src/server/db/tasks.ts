
export interface Task {
  id: string;
  title: string;
  description?: string;
  creationDate: number;
}

const tasks: Task[] = [];

export function getAllTasks(): Task[] {
  return [...tasks];
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function createTask(data: {
  title: string;
  description?: string;
}): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    creationDate: Date.now(),
  };

  tasks.push(task);

  return task;
}

export function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
  }
): Task | undefined {
  const task = getTaskById(id);

  if (!task) {
    return undefined;
  }

  if (data.title !== undefined) {
    task.title = data.title;
  }

  if (data.description !== undefined) {
    task.description = data.description;
  }

  return task;
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  return true;
}
