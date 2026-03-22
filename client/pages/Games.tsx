import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Gamepad2,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Loader,
} from 'lucide-react';
import { Game } from '@shared/api';

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  const [betAmount, setBetAmount] = useState('100');
  const [playing, setPlaying] = useState(false);

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'slots', name: 'Slots' },
    { id: 'cards', name: 'Cards' },
    { id: 'dice', name: 'Dice' },
    { id: 'arcade', name: 'Arcade' },
  ];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async () => {
    if (!selectedGame) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setPlaying(true);
    try {
      const response = await fetch('/api/games/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: selectedGame.id,
          betAmount: parseFloat(betAmount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Show result animation
        alert(`Game Result: ${data.session.result.toUpperCase()}\nProfit: ${data.session.profit}`);
        setShowPlayDialog(false);
        setBetAmount('100');
      }
    } catch (error) {
      console.error('Failed to play game:', error);
      alert('Failed to play game');
    } finally {
      setPlaying(false);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGames = games.slice(0, 4);

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
        {/* Header Section */}
        <section className="px-4 md:px-8 py-8 md:py-12 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Gamepad2 size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Game Lobby</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Choose from our collection of exciting games and start playing today!
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
            </div>
          </div>
        </section>

        {/* Featured Games Section */}
        {featuredGames.length > 0 && (
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
                      <h3 className="text-lg font-bold text-foreground mb-2">{game.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div className="bg-secondary rounded p-2">
                          <p className="text-muted-foreground">RTP</p>
                          <p className="font-bold text-foreground">{(game.rtp * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-secondary rounded p-2">
                          <p className="text-muted-foreground">Bet</p>
                          <p className="font-bold text-foreground">${game.minBet}-${game.maxBet}</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedGame(game);
                          setShowPlayDialog(true);
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
                    <h3 className="text-lg font-bold text-foreground mb-2">{game.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.description}</p>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">RTP</p>
                        <p className="font-bold text-foreground">{(game.rtp * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">Fee</p>
                        <p className="font-bold text-foreground">{(game.houseFee * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-secondary rounded p-2">
                        <p className="text-muted-foreground">Bet</p>
                        <p className="font-bold text-foreground">${game.minBet}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedGame(game);
                          setShowPlayDialog(true);
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/games/${game.id}`)}
                      >
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

        {/* Play Game Dialog */}
        <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedGame?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedGame?.icon}</div>
                <p className="text-muted-foreground">{selectedGame?.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Bet Amount</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      min={selectedGame?.minBet}
                      max={selectedGame?.maxBet}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground py-2">coins</span>
                  </div>
                  {selectedGame && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Min: ${selectedGame.minBet} | Max: ${selectedGame.maxBet}
                    </p>
                  )}
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>RTP</span>
                    <span>{(selectedGame?.rtp || 0 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>House Fee</span>
                    <span>{(selectedGame?.houseFee || 0 * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlayGame}
                  disabled={playing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {playing ? 'Playing...' : 'Play Now'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Games;
