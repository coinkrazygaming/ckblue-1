import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Settings, Loader } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile?: {
    displayName: string;
    avatar?: string;
    level: number;
    bio?: string;
    country?: string;
    totalWins: number;
    totalLosses: number;
    totalGamesPlayed: number;
    winRate: number;
  };
  wallet?: {
    balance: number;
    totalEarned: number;
  };
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        if (data.user.profile) {
          setDisplayName(data.user.profile.displayName);
          setBio(data.user.profile.bio || '');
          setCountry(data.user.profile.country || '');
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSaving(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName, bio, country }),
      });

      const data = await response.json();
      if (data.success) {
        fetchProfile();
        setEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header */}
        <section className="px-4 md:px-8 py-8 md:py-12 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={32} className="text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Profile</h1>
              </div>
              <Button
                onClick={() => setEditing(!editing)}
                variant={editing ? 'outline' : 'default'}
                className="gap-2"
              >
                <Settings size={18} />
                {editing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </section>

        {user && (
          <section className="px-4 md:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              {/* User Info */}
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                <div className="flex items-start justify-between mb-8 pb-8 border-b border-border">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{user.username}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-4xl font-bold text-primary">{user.profile?.level || 1}</p>
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">Display Name</label>
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="mt-2 min-h-24"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Your country"
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Display Name</p>
                      <p className="text-lg font-semibold text-foreground">
                        {user.profile?.displayName || 'Not set'}
                      </p>
                    </div>
                    {user.profile?.bio && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bio</p>
                        <p className="text-foreground">{user.profile.bio}</p>
                      </div>
                    )}
                    {user.profile?.country && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Country</p>
                        <p className="text-foreground">{user.profile.country}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-6">Game Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Games Played</span>
                      <span className="font-semibold text-foreground">
                        {user.profile?.totalGamesPlayed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Wins</span>
                      <span className="font-semibold text-green-500">
                        {user.profile?.totalWins || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Losses</span>
                      <span className="font-semibold text-red-500">
                        {user.profile?.totalLosses || 0}
                      </span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-border">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-semibold text-primary">
                        {((user.profile?.winRate || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-6">Account Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                      <p className="text-3xl font-bold text-primary">
                        ${user.wallet?.balance.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                      <p className="text-2xl font-bold text-green-500">
                        ${user.wallet?.totalEarned.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                      <p className="text-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
