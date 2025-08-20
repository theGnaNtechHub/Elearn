export interface Task {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  type: 'coding' | 'quiz' | 'project' | 'reading';
  createdAt: Date;
  createdBy: string;
}

export interface UserTask {
  userId: string;
  taskId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Variables and Data Types',
    description: 'Learn about basic Python variables and data types',
    courseId: '1',
    difficulty: 'Easy',
    points: 50,
    type: 'coding',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '2',
    title: 'Control Structures',
    description: 'Master if statements and loops in Python',
    courseId: '1',
    difficulty: 'Medium',
    points: 100,
    type: 'coding',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '3',
    title: 'Functions and Modules',
    description: 'Create and use functions in Python',
    courseId: '1',
    difficulty: 'Hard',
    points: 150,
    type: 'project',
    createdAt: new Date(),
    createdBy: 'system'
  }
];

export const loadTasks = (): Task[] => {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    } catch {
      return defaultTasks;
    }
  }
  saveTasks(defaultTasks);
  return defaultTasks;
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const loadUserTasks = (): UserTask[] => {
  const stored = localStorage.getItem('userTasks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((ut: any) => ({
        ...ut,
        completedAt: ut.completedAt ? new Date(ut.completedAt) : undefined
      }));
    } catch {
      return [];
    }
  }
  return [];
};

export const saveUserTasks = (userTasks: UserTask[]): void => {
  localStorage.setItem('userTasks', JSON.stringify(userTasks));
};

export const completeTask = (userId: string, taskId: string, score?: number): boolean => {
  const userTasks = loadUserTasks();
  const existingIndex = userTasks.findIndex(ut => ut.userId === userId && ut.taskId === taskId);
  
  if (existingIndex !== -1) {
    userTasks[existingIndex] = {
      ...userTasks[existingIndex],
      completed: true,
      completedAt: new Date(),
      score
    };
  } else {
    userTasks.push({
      userId,
      taskId,
      completed: true,
      completedAt: new Date(),
      score
    });
  }
  
  saveUserTasks(userTasks);
  return true;
};

export const getUserTasks = (userId: string, courseId?: string) => {
  const tasks = loadTasks();
  const userTasks = loadUserTasks();
  const userTaskMap = new Map(userTasks.map(ut => [`${ut.userId}-${ut.taskId}`, ut]));
  
  const filteredTasks = courseId 
    ? tasks.filter(task => task.courseId === courseId)
    : tasks;
  
  return filteredTasks.map(task => {
    const userTask = userTaskMap.get(`${userId}-${task.id}`);
    return {
      ...task,
      completed: userTask?.completed || false,
      completedAt: userTask?.completedAt,
      score: userTask?.score
    };
  });
};

export const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
  const tasks = loadTasks();
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const deleteTask = (taskId: string): void => {
  const tasks = loadTasks();
  const updated = tasks.filter(t => t.id !== taskId);
  saveTasks(updated);
  
  // Remove user tasks
  const userTasks = loadUserTasks();
  const updatedUserTasks = userTasks.filter(ut => ut.taskId !== taskId);
  saveUserTasks(updatedUserTasks);
};

export const getUserTaskStats = (userId: string) => {
  const userTasks = loadUserTasks().filter(ut => ut.userId === userId && ut.completed);
  const completedCount = userTasks.length;
  const totalPoints = userTasks.reduce((sum, ut) => sum + (ut.score || 0), 0);
  
  return {
    completedTasks: completedCount,
    totalPoints,
    averageScore: completedCount > 0 ? totalPoints / completedCount : 0
  };
};