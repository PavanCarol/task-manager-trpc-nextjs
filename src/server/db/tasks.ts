
export interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
}

// Temporary storage
const tasks: Task[] = [];

// List for the tasks
export function getAllTasks(): Task[] {
  return [...tasks];
}

// Search
export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

// Create
export function createTask(data: {
  titulo: string;
  descricao?: string;
}): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    titulo: data.titulo,
    descricao: data.descricao,
    dataCriacao: Date.now(),
  };

  tasks.push(task);

  return task;
}

// Update
export function updateTask(
  id: string,
  data: {
    titulo?: string;
    descricao?: string;
  }
): Task | undefined {
  const task = getTaskById(id);

  if (!task) {
    return undefined;
  }

  if (data.titulo !== undefined) {
    task.titulo = data.titulo;
  }

  if (data.descricao !== undefined) {
    task.descricao = data.descricao;
  }

  return task;
}

// Delet
export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  return true;
}
