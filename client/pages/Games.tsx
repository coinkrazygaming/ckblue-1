import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Gamepad2,
  Search,
  Filter,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react';

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'slots', name: 'Slots' },
    { id: 'poker', name: 'Poker' },
    { id: 'bingo', name: 'Bingo' },
    { id: 'dice', name: 'Dice' },
    { id: 'scratch', name: 'Scratch Tickets' },
    { id: 'sportsbook', name: 'Sportsbook' },
  ];

  const games = [
    {
      id: 1,
      name: 'Mega Slots',
      category: 'slots',
      players: 1234,
      rtp: 96.5,
      minBet: 0.1,
      maxBet: 100,
      featured: true,
      icon: '🎰',
      description: 'Classic slot machine with 5 reels and 20 paylines',
    },
    {
      id: 2,
      name: 'Diamond Rush',
      category: 'slots',
      players: 856,
      rtp: 95.8,
      minBet: 0.05,
      maxBet: 50,
      featured: true,
      icon: '💎',
      description: 'Jewel-themed slots with progressive jackpot',
    },
    {
      id: 3,
      name: 'Poker Pro',
      category: 'poker',
      players: 567,
      rtp: 98.0,
      minBet: 1,
      maxBet: 500,
      featured: true,
      icon: '🎲',
      description: 'Texas Hold\'em with live multiplayer tables',
    },
    {
      id: 4,
      name: 'Bingo Blitz',
      category: 'bingo',
      players: 2456,
      rtp: 97.2,
      minBet: 0.5,
      maxBet: 25,
      featured: true,
      icon: '🎯',
      description: '75-ball bingo with community chat',
    },
    {
      id: 5,
      name: 'Lucky Dice',
      category: 'dice',
      players: 678,
      rtp: 96.0,
      minBet: 0.1,
      maxBet: 100,
      featured: false,
      icon: '🎲',
      description: 'Roll dice and match combinations',
    },
    {
      id: 6,
      name: 'Gold Mine',
      category: 'slots',
      players: 1890,
      rtp: 96.2,
      minBet: 0.1,
      maxBet: 100,
      featured: false,
      icon: '⛏️',
      description: 'Mining theme slots with bonus rounds',
    },
    {
      id: 7,
      name: 'Scratch Riches',
      category: 'scratch',
      players: 945,
      rtp: 95.5,
      minBet: 0.2,
      maxBet: 20,
      featured: false,
      icon: '🎫',
      description: 'Instant win scratch tickets',
    },
    {
      id: 8,
      name: 'Sports Arena',
      category: 'sportsbook',
      players: 3421,
      rtp: 97.8,
      minBet: 1,
      maxBet: 1000,
      featured: false,
      icon: '⚽',
      description: 'Live sports betting on major events',
    },
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGames = games.filter((g) => g.featured);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header Section */}
        <section className="px-4 md:px-8 py-8 md:py-12 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Gamepad2 size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Game Lobby</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our collection of exciting games and start playing today. Over {games.reduce((sum, g) => sum + g.players, 0).toLocaleString()} players are playing now!
            </p>

            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button variant="outline" size="lg">
                <Filter size={20} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Games Section */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap size={24} className="text-warning" />
              Featured Games
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {featuredGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-gradient-to-br from-card to-secondary border-2 border-primary/50 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-6xl">
                    {game.icon}
                  </div>
                  <div className="p-6">
                    <div className="inline-block mb-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      Featured
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">RTP</p>
                        <p className="font-bold text-foreground">{game.rtp}%</p>
                      </div>
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">Playing</p>
                        <p className="font-bold text-foreground">{game.players}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Play Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Categories</h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Games Grid */}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {selectedCategory === 'all' ? 'All Games' : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center text-5xl border-b border-border">
                    {game.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{game.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">RTP</p>
                        <p className="font-bold text-foreground">{game.rtp}%</p>
                      </div>
                      <div className="bg-secondary rounded p-2 flex items-center justify-center">
                        <div>
                          <p className="text-muted-foreground text-center">Players</p>
                          <p className="font-bold text-foreground">{(game.players / 100).toFixed(0)}K</p>
                        </div>
                      </div>
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">Bet</p>
                        <p className="font-bold text-foreground">${game.minBet}-${game.maxBet}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        Play
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <TrendingUp size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <Gamepad2 size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">No games found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Games;
