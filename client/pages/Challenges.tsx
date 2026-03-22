import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Zap, Loader, Clock } from 'lucide-react';
import { Challenge, UserChallenge } from '@shared/api';

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      if (data.success) {
        setChallenges(data.challenges);
      }

      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await fetch('/api/challenges/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();
        if (userData.success) {
          setUserChallenges(userData.challenges);
        }
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColors = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-yellow-500',
    hard: 'from-red-400 to-red-500',
  };

  const filteredChallenges = selectedDifficulty
    ? challenges.filter(c => c.difficulty === selectedDifficulty)
    : challenges;

  const getUserChallenge = (challengeId: string) =>
    userChallenges.find(uc => uc.challengeId === challengeId);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header */}
        <section className="px-4 md:px-8 py-8 md:py-12 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Daily Challenges</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Complete challenges to earn rewards and climb the leaderboard!
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDifficulty === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                All ({challenges.length})
              </button>
              {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    selectedDifficulty === difficulty
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {difficulty} ({challenges.filter(c => c.difficulty === difficulty).length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Challenges Grid */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredChallenges.map(challenge => {
                const userChallenge = getUserChallenge(challenge.id);
                const progress = userChallenge?.progress || 0;
                const progressPercent = Math.min((progress / challenge.requirementValue) * 100, 100);

                return (
                  <div key={challenge.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{challenge.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        challenge.difficulty === 'easy'
                          ? 'bg-green-500/20 text-green-500'
                          : challenge.difficulty === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {challenge.difficulty}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progress}/{challenge.requirementValue}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{challenge.duration}h</span>
                        <span className="text-sm font-semibold text-primary">{challenge.reward} coins</span>
                      </div>
                      <Button
                        variant={userChallenge?.completed ? "outline" : "default"}
                        disabled={userChallenge?.completed}
                        className="text-sm"
                      >
                        {userChallenge?.completed ? '✓ Completed' : 'In Progress'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Challenges;
