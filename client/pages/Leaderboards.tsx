import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Search, Loader } from 'lucide-react';
import { LeaderboardEntry } from '@shared/api';

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalWins');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/leaderboards?sortBy=${sortBy}&limit=100`);
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Trophy size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Leaderboards</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Compete with other players and climb the ranks!
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSortBy('totalWins')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'totalWins'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                Most Wins
              </button>
              <button
                onClick={() => setSortBy('level')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'level'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                Highest Level
              </button>
            </div>
          </div>
        </section>

        {/* Leaderboard Table */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Rank</th>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Player</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">Wins</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">Win Rate</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaderboard.length > 0 ? (
                      filteredLeaderboard.map((entry) => (
                        <tr key={entry.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-lg">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/20 text-primary rounded-full">
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-foreground">{entry.username}</div>
                              <div className="text-sm text-muted-foreground">{entry.displayName || 'Player'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-lg font-bold text-primary">{entry.totalWins}</div>
                            <div className="text-xs text-muted-foreground">{entry.totalGamesPlayed} games</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-lg font-bold">{(entry.winRate * 100).toFixed(1)}%</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-lg font-bold text-accent">{entry.level}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No players found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Leaderboards;
