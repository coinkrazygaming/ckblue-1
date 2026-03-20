import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Gamepad2,
  Trophy,
  Star,
  Gift,
  Zap,
  TrendingUp,
  ChevronRight,
  Crown,
  Sparkles,
  Users,
  Clock,
  Target,
} from 'lucide-react';

const Index = () => {
  const featuredGames = [
    { id: 1, name: 'Mega Slots', type: 'slots', players: 1234, image: '🎰' },
    { id: 2, name: 'Poker Pro', type: 'poker', players: 856, image: '🎲' },
    { id: 3, name: 'Bingo Blitz', type: 'bingo', players: 2456, image: '🎯' },
    { id: 4, name: 'Lucky Dice', type: 'dice', players: 678, image: '🎲' },
  ];

  const leaderboardUsers = [
    { rank: 1, name: 'HighRoller42', winnings: '$8,234', streak: '15d' },
    { rank: 2, name: 'LuckyCharm', winnings: '$6,789', streak: '12d' },
    { rank: 3, name: 'MegaWins', winnings: '$5,456', streak: '10d' },
  ];

  const challenges = [
    { id: 1, name: 'Morning Spin', description: 'Spin 5 games', reward: '50 GC', progress: 3 },
    { id: 2, name: 'Lucky Strike', description: 'Win 3 games', reward: '25 SC', progress: 1 },
    { id: 3, name: 'Weekly Wager', description: 'Wager 500 GC', reward: '100 GC', progress: 250 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Hero Section */}
        <section className="relative pt-8 px-4 md:pt-12 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div className="animate-slide-in">
                <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Sparkles size={16} />
                    AI-Powered Gaming Platform
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Experience the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Social Gaming</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Play thrilling games, earn real rewards, compete with friends, and unlock exclusive achievements on the ultimate gaming platform.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Link to="/games">
                    <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start Playing
                      <ChevronRight size={20} className="ml-2" />
                    </Button>
                  </Link>
                  <Link to="/store">
                    <Button size="lg" variant="outline" className="w-full md:w-auto">
                      Get Gold Coins
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                  <div className="relative bg-card border border-border rounded-3xl p-12 flex items-center justify-center h-96">
                    <div className="text-center">
                      <Gamepad2 size={120} className="text-primary mx-auto mb-4 animate-float" />
                      <p className="text-xl font-bold text-foreground">Ready to Win Big?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games Section */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Featured Games</h2>
              <Link to="/games">
                <Button variant="ghost" className="text-primary hover:text-primary/90">
                  View All <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredGames.map((game) => (
                <Link key={game.id} to={`/games/${game.id}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer group">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {game.image}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      <Users size={14} className="inline mr-1" />
                      {game.players.toLocaleString()} playing
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-primary border-primary/50 hover:bg-primary/10">
                      Play Now
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Challenges Section */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Daily Challenges</h2>
              <Link to="/challenges">
                <Button variant="ghost" className="text-primary hover:text-primary/90">
                  View All <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Target size={24} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{challenge.name}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300"
                      style={{ width: `${(challenge.progress / (challenge.reward.includes('SC') ? 3 : challenge.reward === '100 GC' ? 500 : 5)) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Clock size={14} className="inline mr-1" />
                      {challenge.progress}/{challenge.reward.includes('SC') ? 3 : challenge.reward === '100 GC' ? 500 : 5}
                    </span>
                    <span className="font-semibold text-success">{challenge.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard Preview Section */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Weekly Leaderboard</h2>
              <Link to="/leaderboards">
                <Button variant="ghost" className="text-primary hover:text-primary/90">
                  See Rankings <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="grid md:grid-cols-12 gap-4 p-6 bg-secondary/30 border-b border-border text-sm font-semibold text-muted-foreground">
                <div className="md:col-span-1">Rank</div>
                <div className="md:col-span-6">Player</div>
                <div className="md:col-span-3">Winnings</div>
                <div className="md:col-span-2">Win Streak</div>
              </div>
              <div className="divide-y divide-border">
                {leaderboardUsers.map((user) => (
                  <div key={user.rank} className="grid md:grid-cols-12 gap-4 p-6 hover:bg-secondary/20 transition-colors duration-200">
                    <div className="md:col-span-1">
                      <div className="flex items-center justify-center">
                        {user.rank === 1 && <Trophy size={24} className="text-yellow-500" />}
                        {user.rank === 2 && <Trophy size={24} className="text-gray-400" />}
                        {user.rank === 3 && <Trophy size={24} className="text-orange-600" />}
                        {user.rank > 3 && (
                          <span className="font-bold text-foreground">#{user.rank}</span>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-6">
                      <p className="font-bold text-foreground">{user.name}</p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-semibold text-success text-lg">{user.winnings}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-muted-foreground">{user.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIP Promotion Section */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 rounded-2xl border border-primary/30 p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <Crown size={300} />
              </div>
              <div className="relative z-10">
                <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/20">
                  <span className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Crown size={16} />
                    Exclusive VIP Club
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Join the Elite Gaming Club
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                  Unlock exclusive rewards, priority support, higher win rates, and private games. VIP members get 20% bonus on every purchase.
                </p>
                <Link to="/vip">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Learn About VIP <ChevronRight size={20} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Your Achievements</h2>
              <Link to="/achievements">
                <Button variant="ghost" className="text-primary hover:text-primary/90">
                  View All <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Gamepad2, title: 'First Win', unlocked: true },
                { icon: Zap, title: 'Lightning Streak', unlocked: true },
                { icon: Trophy, title: 'Champion', unlocked: false },
                { icon: Sparkles, title: 'Legendary', unlocked: false },
              ].map((achievement, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-6 border transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-card border-accent/50 hover:border-accent'
                      : 'bg-secondary/30 border-border/50 opacity-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`p-4 rounded-xl mb-4 ${
                        achievement.unlocked ? 'bg-accent/20' : 'bg-muted/20'
                      }`}
                    >
                      <achievement.icon
                        size={32}
                        className={achievement.unlocked ? 'text-accent' : 'text-muted-foreground'}
                      />
                    </div>
                    <h3 className="font-bold text-foreground">{achievement.title}</h3>
                    {achievement.unlocked && (
                      <p className="text-xs text-success mt-2">✓ Unlocked</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl border border-primary/30 p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Winning?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of players enjoying CoinKrazy. Play games, earn rewards, and compete with friends.
              </p>
              <Link to="/games">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Play Now <Gamepad2 size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
            <p className="mb-4">© 2024 CoinKrazy AI. All rights reserved.</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
