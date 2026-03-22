import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader } from 'lucide-react';
import { Game } from '@shared/api';

interface GameStats {
  totalPlays: number;
  totalBets: number;
  totalWinnings: number;
  winRate: number;
}

const GameDetail = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  const [betAmount, setBetAmount] = useState('100');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      if (data.success) {
        setGame(data.game);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch game details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async () => {
    if (!game) return;

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
          gameId: game.id,
          betAmount: parseFloat(betAmount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Game Result: ${data.session.result.toUpperCase()}\nProfit: ${data.session.profit}`);
        setShowPlayDialog(false);
        setBetAmount('100');
        // Refresh stats
        fetchGameDetails();
      }
    } catch (error) {
      console.error('Failed to play game:', error);
      alert('Failed to play game');
    } finally {
      setPlaying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      </Layout>
    );
  }

  if (!game) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <Button onClick={() => navigate('/games')}>Back to Games</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header */}
        <section className="px-4 md:px-8 py-8 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft size={20} />
              Back to Games
            </button>

            <div className="flex items-center gap-6 mb-8">
              <div className="text-7xl">{game.icon}</div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{game.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{game.description}</p>
                <p className="text-muted-foreground">{game.rules}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats and Details */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Game Statistics */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">Game Statistics</h2>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Total Plays</span>
                    <span className="text-2xl font-bold text-primary">
                      {stats?.totalPlays.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="text-2xl font-bold text-primary">
                      {((stats?.winRate || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Total Bets</span>
                    <span className="text-2xl font-bold text-primary">
                      ${stats?.totalBets.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Winnings</span>
                    <span className="text-2xl font-bold text-green-500">
                      ${stats?.totalWinnings.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Game Rules and Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">Game Details</h2>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold text-foreground capitalize">{game.category}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-muted-foreground">Minimum Bet</span>
                    <span className="font-semibold text-foreground">${game.minBet}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-muted-foreground">Maximum Bet</span>
                    <span className="font-semibold text-foreground">${game.maxBet}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-muted-foreground">House Fee</span>
                    <span className="font-semibold text-foreground">{(game.houseFee * 100).toFixed(2)}%</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-muted-foreground">Return to Player (RTP)</span>
                    <span className="font-semibold text-foreground">{(game.rtp * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="flex gap-4">
              <Button
                onClick={() => setShowPlayDialog(true)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
              >
                Play Now
              </Button>
              <Button variant="outline" className="flex-1 h-12 text-lg">
                Watchlist
              </Button>
            </div>
          </div>
        </section>

        {/* Play Game Dialog */}
        <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{game.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <p className="text-muted-foreground">{game.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Bet Amount</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      min={game.minBet}
                      max={game.maxBet}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground py-2">coins</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Min: ${game.minBet} | Max: ${game.maxBet}
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>RTP</span>
                    <span>{(game.rtp * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>House Fee</span>
                    <span>{(game.houseFee * 100).toFixed(1)}%</span>
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

export default GameDetail;
