export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  timeLimit: string;
  reward: string;
  points: number;
  createdAt: Date;
  createdBy: string;
}

export interface UserChallenge {
  userId: string;
  challengeId: string;
  status: 'joined' | 'completed' | 'failed';
  score?: number;
  completedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  rank: number;
}

const defaultChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Algorithm Speed Challenge',
    description: 'Test your algorithm optimization skills',
    difficulty: 'Medium',
    participants: 156,
    timeLimit: '45 min',
    reward: '500 points',
    points: 500,
    createdAt: new Date(),
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Data Structure Battle',
    description: 'Master complex data structures',
    difficulty: 'Hard',
    participants: 89,
    timeLimit: '60 min',
    reward: '750 points',
    points: 750,
    createdAt: new Date(),
    createdBy: 'admin'
  },
  {
    id: '3',
    title: 'Logic Puzzle Sprint',
    description: 'Solve logical problems quickly',
    difficulty: 'Easy',
    participants: 234,
    timeLimit: '30 min',
    reward: '300 points',
    points: 300,
    createdAt: new Date(),
    createdBy: 'admin'
  }
];

export const loadChallenges = (): Challenge[] => {
  const stored = localStorage.getItem('challenges');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((challenge: any) => ({
        ...challenge,
        createdAt: new Date(challenge.createdAt)
      }));
    } catch {
      return defaultChallenges;
    }
  }
  saveChallenges(defaultChallenges);
  return defaultChallenges;
};

export const saveChallenges = (challenges: Challenge[]): void => {
  localStorage.setItem('challenges', JSON.stringify(challenges));
};

export const loadUserChallenges = (): UserChallenge[] => {
  const stored = localStorage.getItem('userChallenges');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((uc: any) => ({
        ...uc,
        completedAt: uc.completedAt ? new Date(uc.completedAt) : undefined
      }));
    } catch {
      return [];
    }
  }
  return [];
};

export const saveUserChallenges = (userChallenges: UserChallenge[]): void => {
  localStorage.setItem('userChallenges', JSON.stringify(userChallenges));
};

export const joinChallenge = (userId: string, challengeId: string): boolean => {
  const userChallenges = loadUserChallenges();
  const existing = userChallenges.find(uc => uc.userId === userId && uc.challengeId === challengeId);
  
  if (existing) {
    return false; // Already joined
  }

  userChallenges.push({
    userId,
    challengeId,
    status: 'joined'
  });

  saveUserChallenges(userChallenges);

  // Update participant count
  const challenges = loadChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  if (challenge) {
    challenge.participants += 1;
    saveChallenges(challenges);
  }

  return true;
};

export const completeChallenge = (userId: string, challengeId: string, score: number): void => {
  const userChallenges = loadUserChallenges();
  const userChallenge = userChallenges.find(uc => uc.userId === userId && uc.challengeId === challengeId);
  
  if (userChallenge) {
    userChallenge.status = 'completed';
    userChallenge.score = score;
    userChallenge.completedAt = new Date();
    saveUserChallenges(userChallenges);
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const userChallenges = loadUserChallenges();
  const userPoints: { [userId: string]: number } = {};

  // Calculate total points for each user
  userChallenges.forEach(uc => {
    if (uc.status === 'completed' && uc.score) {
      if (!userPoints[uc.userId]) {
        userPoints[uc.userId] = 0;
      }
      userPoints[uc.userId] += uc.score;
    }
  });

  // Get user names and create leaderboard entries
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const leaderboard: LeaderboardEntry[] = [];

  Object.entries(userPoints).forEach(([userId, points]) => {
    const user = users.find((u: any) => u.id === userId);
    if (user) {
      leaderboard.push({
        userId,
        name: user.name,
        points,
        rank: 0
      });
    }
  });

  // Sort by points and assign ranks
  leaderboard.sort((a, b) => b.points - a.points);
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return leaderboard;
};

export const addChallenge = (challengeData: Omit<Challenge, 'id' | 'createdAt' | 'participants'>): Challenge => {
  const challenges = loadChallenges();
  const newChallenge: Challenge = {
    ...challengeData,
    id: Date.now().toString(),
    createdAt: new Date(),
    participants: 0
  };

  challenges.push(newChallenge);
  saveChallenges(challenges);
  return newChallenge;
};

export const deleteChallenge = (challengeId: string): void => {
  const challenges = loadChallenges();
  const updated = challenges.filter(c => c.id !== challengeId);
  saveChallenges(updated);

  // Remove user challenges
  const userChallenges = loadUserChallenges();
  const updatedUserChallenges = userChallenges.filter(uc => uc.challengeId !== challengeId);
  saveUserChallenges(updatedUserChallenges);
};