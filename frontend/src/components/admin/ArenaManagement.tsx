import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, Trophy } from "lucide-react";
import { loadChallenges, addChallenge, deleteChallenge, Challenge } from "@/utils/arenaManager";
import { useToast } from "@/hooks/use-toast";

interface ArenaManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArenaManagement = ({ isOpen, onClose }: ArenaManagementProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    timeLimit: '',
    points: 0,
    createdBy: 'admin'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      refreshChallenges();
    }
  }, [isOpen]);

  const refreshChallenges = () => {
    const loadedChallenges = loadChallenges();
    setChallenges(loadedChallenges);
  };

  const handleAddChallenge = () => {
    if (!newChallenge.title || !newChallenge.description || !newChallenge.timeLimit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const challenge = addChallenge({
      ...newChallenge,
      reward: `${newChallenge.points} points`
    });

    setChallenges(prev => [...prev, challenge]);
    setNewChallenge({
      title: '',
      description: '',
      difficulty: 'Medium',
      timeLimit: '',
      points: 0,
      createdBy: 'admin'
    });
    setShowAddModal(false);

    toast({
      title: "Challenge Added",
      description: "New challenge has been created successfully."
    });
  };

  const handleDeleteChallenge = (challengeId: string, challengeTitle: string) => {
    deleteChallenge(challengeId);
    setChallenges(prev => prev.filter(c => c.id !== challengeId));
    
    toast({
      title: "Challenge Deleted",
      description: `"${challengeTitle}" has been removed.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Arena Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Challenges</h3>
            <Button onClick={() => setShowAddModal(true)} className="btn-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Challenge
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-primary">{challenge.title}</h4>
                      <Badge variant={challenge.difficulty === "Easy" ? "secondary" : 
                                   challenge.difficulty === "Medium" ? "default" : "destructive"}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-platform-gray-dark mb-2">{challenge.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {challenge.participants} participants
                      </span>
                      <span>{challenge.timeLimit}</span>
                      <span>{challenge.reward}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChallenge(challenge.id, challenge.title)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Challenge Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter challenge title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter challenge description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select 
                    value={newChallenge.difficulty} 
                    onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => 
                      setNewChallenge(prev => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit</Label>
                  <Input
                    id="timeLimit"
                    value={newChallenge.timeLimit}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, timeLimit: e.target.value }))}
                    placeholder="e.g., 45 min"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={newChallenge.points}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddChallenge} className="btn-accent">
                  Add Challenge
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default ArenaManagement;