import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sword, Trophy, Users, Clock } from "lucide-react";
import { loadChallenges, joinChallenge, getLeaderboard, completeChallenge } from "@/utils/arenaManager";
import { getCurrentUser } from "@/utils/userAuth";
import { useToast } from "@/hooks/use-toast";
import { addNotification } from "@/utils/notificationManager";
import { checkAndAwardTrophies } from "@/utils/achievementManager";

const Arena = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  const refreshData = () => {
    const loadedChallenges = loadChallenges();
    setChallenges(loadedChallenges);
    
    const leaderboardData = getLeaderboard();
    if (currentUser && !leaderboardData.find(entry => entry.userId === currentUser.id)) {
      leaderboardData.push({
        userId: currentUser.id,
        name: currentUser.name,
        points: 0,
        rank: leaderboardData.length + 1
      });
    }
    setLeaderboard(leaderboardData);
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const handleJoinChallenge = (challengeId: string, challengeTitle: string) => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to join challenges.",
        variant: "destructive"
      });
      return;
    }

    const success = joinChallenge(currentUser.id, challengeId);
    if (success) {
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, participants: c.participants + 1 } : c
      ));
      
      // Add notification
      addNotification({
        userId: currentUser.id,
        type: 'general',
        title: "Challenge Joined!",
        message: `You've successfully joined "${challengeTitle}". Good luck!`
      });

      toast({
        title: "Challenge joined!",
        description: `You've successfully joined "${challengeTitle}".`
      });
    } else {
      toast({
        title: "Already joined",
        description: "You've already joined this challenge.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteChallenge = (challengeId: string) => {
    if (!currentUser) return;

    const score = Math.floor(Math.random() * 100) + 1; // Simulate score
    completeChallenge(currentUser.id, challengeId, score);
    
    const challenge = challenges.find(c => c.id === challengeId);
    addNotification({
      userId: currentUser.id,
      type: 'general',
      title: "Challenge Completed!",
      message: `You completed "${challenge?.title}" with a score of ${score}!`
    });

    // Check for rank position and award trophies
    const updatedLeaderboard = getLeaderboard();
    const userRank = updatedLeaderboard.findIndex(entry => entry.userId === currentUser.id) + 1;
    
    // Award trophies based on performance
    checkAndAwardTrophies(currentUser.id, { rank: userRank });
    
    toast({
      title: "Challenge Completed! 🎯",
      description: `You scored ${score} points! Your rank: #${userRank}`,
    });

    refreshData();
  };

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">Arena</h1>
          <p className="text-platform-gray-dark">
            Challenge yourself and compete with others
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-primary">Active Challenges</h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="card-elevated hover:scale-102 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-primary">
                        {challenge.title}
                      </CardTitle>
                      <Badge 
                        variant={challenge.difficulty === "Easy" ? "secondary" : 
                                challenge.difficulty === "Medium" ? "default" : "destructive"}
                      >
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-platform-gray-dark" />
                        <span>{challenge.participants} joined</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-platform-gray-dark" />
                        <span>{challenge.timeLimit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span>{challenge.reward}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 btn-accent"
                        onClick={() => handleJoinChallenge(challenge.id, challenge.title)}
                      >
                        <Sword className="w-4 h-4 mr-2" />
                        Join Challenge
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleCompleteChallenge(challenge.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card className="card-elevated sticky top-24">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.slice(0, 10).map((user) => (
                  <div key={user.rank} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank <= 3 ? 'bg-accent text-white' : 'bg-platform-gray text-platform-gray-dark'
                      }`}>
                        {user.rank}
                      </div>
                      <span className={currentUser && user.userId === currentUser.id ? "font-semibold text-primary" : ""}>
                        {currentUser && user.userId === currentUser.id ? "You" : user.name}
                      </span>
                    </div>
                    <span className="text-sm text-platform-gray-dark">
                      {user.points}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;