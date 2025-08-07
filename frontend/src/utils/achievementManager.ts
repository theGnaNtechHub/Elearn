export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'Medals' | 'Badges' | 'Certificates' | 'Trophies';
  points: number;
  icon: string;
  requirements: string;
  createdAt: Date;
  createdBy: string;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: Date;
  progress?: number;
}

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first lesson',
    category: 'Medals',
    points: 50,
    icon: '🏅',
    requirements: 'Complete 1 lesson',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '2',
    name: 'Code Warrior',
    description: 'Solved 10 coding challenges',
    category: 'Medals',
    points: 200,
    icon: '⚔️',
    requirements: 'Complete 10 challenges',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '3',
    name: 'Logic Master',
    description: 'Created 5 flowcharts',
    category: 'Medals',
    points: 150,
    icon: '🧠',
    requirements: 'Create 5 flowcharts',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '4',
    name: 'Consistent Learner',
    description: '7-day learning streak',
    category: 'Badges',
    points: 300,
    icon: '🔥',
    requirements: 'Learn for 7 consecutive days',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '5',
    name: 'Algorithm Expert',
    description: 'Mastered sorting algorithms',
    category: 'Badges',
    points: 400,
    icon: '🎯',
    requirements: 'Complete algorithm course',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '6',
    name: 'Problem Solver',
    description: 'Solved 50 problems',
    category: 'Badges',
    points: 500,
    icon: '🧩',
    requirements: 'Solve 50 problems',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '7',
    name: 'Python Basics',
    description: 'Completed Python fundamentals',
    category: 'Certificates',
    points: 1000,
    icon: '📜',
    requirements: 'Complete Python basics course',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '8',
    name: 'Data Structures',
    description: 'Mastered core data structures',
    category: 'Certificates',
    points: 1200,
    icon: '📋',
    requirements: 'Complete data structures course',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '9',
    name: 'Speed Demon',
    description: 'Fastest solution in contest',
    category: 'Trophies',
    points: 800,
    icon: '🏆',
    requirements: 'Win a speed contest',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '10',
    name: 'Helping Hand',
    description: 'Helped 10 fellow learners',
    category: 'Trophies',
    points: 600,
    icon: '🤝',
    requirements: 'Help 10 other students',
    createdAt: new Date(),
    createdBy: 'system'
  }
];

export const loadAchievements = (): Achievement[] => {
  const stored = localStorage.getItem('achievements');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((achievement: any) => ({
        ...achievement,
        createdAt: new Date(achievement.createdAt)
      }));
    } catch {
      return defaultAchievements;
    }
  }
  saveAchievements(defaultAchievements);
  return defaultAchievements;
};

export const saveAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem('achievements', JSON.stringify(achievements));
};

export const loadUserAchievements = (): UserAchievement[] => {
  const stored = localStorage.getItem('userAchievements');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((ua: any) => ({
        ...ua,
        earnedAt: new Date(ua.earnedAt)
      }));
    } catch {
      return [];
    }
  }
  return [];
};

export const saveUserAchievements = (userAchievements: UserAchievement[]): void => {
  localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
};

export const awardAchievement = (userId: string, achievementId: string): boolean => {
  const userAchievements = loadUserAchievements();
  const existing = userAchievements.find(ua => ua.userId === userId && ua.achievementId === achievementId);
  
  if (existing) {
    return false; // Already earned
  }

  userAchievements.push({
    userId,
    achievementId,
    earnedAt: new Date()
  });

  saveUserAchievements(userAchievements);
  return true;
};

// Dynamic achievement awarding functions
export const checkAndAwardMedals = (userId: string, taskCount: number): void => {
  const achievements = loadAchievements();
  
  // Award medal for first task
  if (taskCount >= 1) {
    const firstTaskMedal = achievements.find(a => a.name === 'First Steps');
    if (firstTaskMedal) {
      awardAchievement(userId, firstTaskMedal.id);
    }
  }
  
  // Award medal for 10 tasks (coding challenges)
  if (taskCount >= 10) {
    const codeWarriorMedal = achievements.find(a => a.name === 'Code Warrior');
    if (codeWarriorMedal) {
      awardAchievement(userId, codeWarriorMedal.id);
    }
  }
};

export const checkAndAwardBadges = (userId: string, sectionCount: number): void => {
  const achievements = loadAchievements();
  
  // Award badge for completing sections
  if (sectionCount >= 7) {
    const consistentLearner = achievements.find(a => a.name === 'Consistent Learner');
    if (consistentLearner) {
      awardAchievement(userId, consistentLearner.id);
    }
  }
  
  if (sectionCount >= 10) {
    const problemSolver = achievements.find(a => a.name === 'Problem Solver');
    if (problemSolver) {
      awardAchievement(userId, problemSolver.id);
    }
  }
};

export const checkAndAwardCertificates = (userId: string, courseTitle: string): void => {
  const achievements = loadAchievements();
  
  // Award certificate based on course completion
  if (courseTitle.toLowerCase().includes('python')) {
    const pythonCert = achievements.find(a => a.name === 'Python Basics');
    if (pythonCert) {
      awardAchievement(userId, pythonCert.id);
    }
  }
  
  if (courseTitle.toLowerCase().includes('data structure')) {
    const dataStructCert = achievements.find(a => a.name === 'Data Structures');
    if (dataStructCert) {
      awardAchievement(userId, dataStructCert.id);
    }
  }
};

export const checkAndAwardTrophies = (userId: string, challengeResult: { rank: number, helpCount?: number }): void => {
  const achievements = loadAchievements();
  
  // Award trophy for winning contests
  if (challengeResult.rank === 1) {
    const speedDemon = achievements.find(a => a.name === 'Speed Demon');
    if (speedDemon) {
      awardAchievement(userId, speedDemon.id);
    }
  }
  
  // Award trophy for helping others
  if (challengeResult.helpCount && challengeResult.helpCount >= 10) {
    const helpingHand = achievements.find(a => a.name === 'Helping Hand');
    if (helpingHand) {
      awardAchievement(userId, helpingHand.id);
    }
  }
};

export const getUserAchievements = (userId: string) => {
  const achievements = loadAchievements();
  const userAchievements = loadUserAchievements();
  const userEarned = userAchievements.filter(ua => ua.userId === userId);

  const categorized = {
    Medals: { earned: 0, total: 0, achievements: [] as any[] },
    Badges: { earned: 0, total: 0, achievements: [] as any[] },
    Certificates: { earned: 0, total: 0, achievements: [] as any[] },
    Trophies: { earned: 0, total: 0, achievements: [] as any[] }
  };

  achievements.forEach(achievement => {
    const isEarned = userEarned.some(ua => ua.achievementId === achievement.id);
    categorized[achievement.category].total += 1;
    if (isEarned) {
      categorized[achievement.category].earned += 1;
    }
    
    categorized[achievement.category].achievements.push({
      ...achievement,
      earned: isEarned
    });
  });

  const totalEarned = Object.values(categorized).reduce((sum, cat) => sum + cat.earned, 0);
  const totalAchievements = Object.values(categorized).reduce((sum, cat) => sum + cat.total, 0);
  const completionRate = totalAchievements > 0 ? Math.round((totalEarned / totalAchievements) * 100) : 0;
  const totalPoints = userEarned.reduce((sum, ua) => {
    const achievement = achievements.find(a => a.id === ua.achievementId);
    return sum + (achievement?.points || 0);
  }, 0);

  return {
    categorized,
    stats: {
      totalEarned,
      completionRate,
      totalPoints,
      dayStreak: 15 // TODO: Calculate actual streak
    }
  };
};

export const addAchievement = (achievementData: Omit<Achievement, 'id' | 'createdAt'>): Achievement => {
  const achievements = loadAchievements();
  const newAchievement: Achievement = {
    ...achievementData,
    id: Date.now().toString(),
    createdAt: new Date()
  };

  achievements.push(newAchievement);
  saveAchievements(achievements);
  return newAchievement;
};

export const deleteAchievement = (achievementId: string): void => {
  const achievements = loadAchievements();
  const updated = achievements.filter(a => a.id !== achievementId);
  saveAchievements(updated);

  // Remove user achievements
  const userAchievements = loadUserAchievements();
  const updatedUserAchievements = userAchievements.filter(ua => ua.achievementId !== achievementId);
  saveUserAchievements(updatedUserAchievements);
};