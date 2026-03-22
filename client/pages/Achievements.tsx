import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Star, Loader } from 'lucide-react';
import { Achievement } from '@shared/api';

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      if (data.success) {
        setAchievements(data.achievements);
      }

      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await fetch('/api/achievements/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();
        if (userData.success) {
          setUserAchievements(userData.achievements);
        }
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-yellow-400 to-yellow-500',
  };

  const filteredAchievements = selectedRarity
    ? achievements.filter(a => a.rarity === selectedRarity)
    : achievements;

  const isUnlocked = (achievementId: string) =>
    userAchievements.some(a => a.id === achievementId);

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
              <Star size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Achievements</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Unlock achievements and earn rewards as you play. You have unlocked {userAchievements.length} of {achievements.length} achievements!
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedRarity(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRarity === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                All ({achievements.length})
              </button>
              {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setSelectedRarity(rarity)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    selectedRarity === rarity
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {rarity} ({achievements.filter(a => a.rarity === rarity).length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Grid */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map(achievement => {
                const unlocked = isUnlocked(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-lg overflow-hidden transition-all duration-300 ${
                      unlocked
                        ? `bg-gradient-to-br ${rarityColors[achievement.rarity as keyof typeof rarityColors]} border-2 border-primary`
                        : 'bg-card border border-border opacity-50'
                    }`}
                  >
                    <div className={`aspect-square flex items-center justify-center text-6xl ${!unlocked && 'opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="p-6">
                      <h3 className={`text-lg font-bold mb-2 ${unlocked ? 'text-white' : 'text-foreground'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${unlocked ? 'text-white/90' : 'text-muted-foreground'}`}>
                        {achievement.description}
                      </p>

                      <div className={`flex justify-between items-center ${unlocked ? 'text-white' : 'text-foreground'}`}>
                        <span className={`text-sm font-semibold ${unlocked ? '' : 'opacity-75'}`}>
                          {achievement.points} pts
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          unlocked
                            ? 'bg-white/20'
                            : 'bg-secondary'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>

                      {unlocked && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-xs text-white/70">✓ Unlocked</p>
                        </div>
                      )}
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

export default Achievements;
