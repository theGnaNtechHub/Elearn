export interface Course {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  description: string;
  duration: string;
  rating: number;
  students: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  createdAt: string;
}

export interface UserCourse {
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
  lastAccessedAt: string;
  completed: boolean;
}

// Mock courses data
const defaultCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Algorithms',
    author: 'Dr. Sarah Chen',
    thumbnail: '🧮',
    description: 'Learn the fundamentals of algorithms and data structures',
    duration: '8 hours',
    rating: 4.8,
    students: 1234,
    level: 'Beginner',
    category: 'Computer Science',
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-2',
    title: 'Data Structures Mastery',
    author: 'Prof. Michael Rodriguez',
    thumbnail: '🏗️',
    description: 'Master advanced data structures and their applications',
    duration: '12 hours',
    rating: 4.9,
    students: 987,
    level: 'Intermediate',
    category: 'Computer Science',
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-3',
    title: 'Python Programming Fundamentals',
    author: 'Lisa Thompson',
    thumbnail: '🐍',
    description: 'Complete guide to Python programming from basics to advanced',
    duration: '6 hours',
    rating: 4.7,
    students: 2341,
    level: 'Beginner',
    category: 'Programming',
    createdAt: new Date().toISOString()
  }
];

// Load courses from localStorage
export const loadCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem('vteach_courses');
    if (storedCourses) {
      return JSON.parse(storedCourses);
    } else {
      saveCourses(defaultCourses);
      return defaultCourses;
    }
  } catch (error) {
    console.error('Error loading courses:', error);
    saveCourses(defaultCourses);
    return defaultCourses;
  }
};

// Save courses to localStorage
export const saveCourses = (courses: Course[]): void => {
  try {
    localStorage.setItem('vteach_courses', JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving courses:', error);
  }
};

// Load user courses from localStorage
export const loadUserCourses = (): UserCourse[] => {
  try {
    const storedUserCourses = localStorage.getItem('vteach_user_courses');
    return storedUserCourses ? JSON.parse(storedUserCourses) : [];
  } catch (error) {
    console.error('Error loading user courses:', error);
    return [];
  }
};

// Save user courses to localStorage
export const saveUserCourses = (userCourses: UserCourse[]): void => {
  try {
    localStorage.setItem('vteach_user_courses', JSON.stringify(userCourses));
  } catch (error) {
    console.error('Error saving user courses:', error);
  }
};

// Enroll user in course
export const enrollUserInCourse = (userId: string, courseId: string): boolean => {
  const userCourses = loadUserCourses();
  const existingEnrollment = userCourses.find(uc => uc.userId === userId && uc.courseId === courseId);
  
  if (existingEnrollment) {
    return false; // Already enrolled
  }
  
  const newEnrollment: UserCourse = {
    userId,
    courseId,
    progress: 0,
    enrolledAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    completed: false
  };
  
  userCourses.push(newEnrollment);
  saveUserCourses(userCourses);
  return true;
};

// Get user's enrolled courses
export const getUserCourses = (userId: string): (Course & { progress: number })[] => {
  const userCourses = loadUserCourses();
  const courses = loadCourses();
  
  return userCourses
    .filter(uc => uc.userId === userId)
    .map(uc => {
      const course = courses.find(c => c.id === uc.courseId);
      return course ? { ...course, progress: uc.progress } : null;
    })
    .filter(Boolean) as (Course & { progress: number })[];
};

// Update course progress
export const updateCourseProgress = (userId: string, courseId: string, progress: number): void => {
  const userCourses = loadUserCourses();
  const userCourse = userCourses.find(uc => uc.userId === userId && uc.courseId === courseId);
  
  if (userCourse) {
    userCourse.progress = Math.min(100, Math.max(0, progress));
    userCourse.lastAccessedAt = new Date().toISOString();
    userCourse.completed = userCourse.progress === 100;
    saveUserCourses(userCourses);
  }
};

// Get user level based on course progress
export const getUserLevel = (userId: string): { level: number; progress: number; nextLevelProgress: number } => {
  const userCourses = loadUserCourses().filter(uc => uc.userId === userId);
  
  if (userCourses.length === 0) {
    return { level: 1, progress: 0, nextLevelProgress: 100 };
  }
  
  const totalProgress = userCourses.reduce((sum, uc) => sum + uc.progress, 0);
  const averageProgress = totalProgress / userCourses.length;
  const completedCourses = userCourses.filter(uc => uc.completed).length;
  
  // Level calculation based on completed courses and average progress
  const level = Math.floor(completedCourses / 2) + Math.floor(averageProgress / 25) + 1;
  const progressInCurrentLevel = ((averageProgress % 25) / 25) * 100;
  
  return {
    level: Math.max(1, level),
    progress: progressInCurrentLevel,
    nextLevelProgress: 100 - progressInCurrentLevel
  };
};

// Add new course
export const addCourse = (courseData: Omit<Course, 'id' | 'createdAt'>): Course => {
  const courses = loadCourses();
  const newCourse: Course = {
    ...courseData,
    id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
};

// Delete course
export const deleteCourse = (courseId: string): boolean => {
  const courses = loadCourses();
  const filteredCourses = courses.filter(c => c.id !== courseId);
  
  if (filteredCourses.length !== courses.length) {
    saveCourses(filteredCourses);
    
    // Also remove user enrollments for this course
    const userCourses = loadUserCourses();
    const filteredUserCourses = userCourses.filter(uc => uc.courseId !== courseId);
    saveUserCourses(filteredUserCourses);
    
    return true;
  }
  return false;
};

// Initialize courses on module load
loadCourses();