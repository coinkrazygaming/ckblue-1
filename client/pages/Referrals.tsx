import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Copy, Loader } from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  referrals: any[];
}

const Referrals = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const [codeRes, statsRes] = await Promise.all([
        fetch('/api/referrals/code', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/referrals/stats', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const codeData = await codeRes.json();
      if (codeData.success) {
        setReferralCode(codeData.referralCode);
      }

      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReferral = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setApplying(true);
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referralCode: referralInput }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Referral applied successfully! You earned a bonus!');
        setReferralInput('');
        fetchReferralData();
      } else {
        alert(data.error || 'Failed to apply referral');
      }
    } catch (error) {
      console.error('Failed to apply referral:', error);
    } finally {
      setApplying(false);
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Referrals</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Earn rewards by referring your friends to CoinKrazy!
            </p>
          </div>
        </section>

        {/* Referral Code Section */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Your Referral Code</h2>
              <p className="text-white/90 mb-6">
                Share this code with your friends and earn rewards when they join!
              </p>
              <div className="flex gap-3">
                <div className="flex-1 bg-white/20 rounded-lg px-4 py-3 font-mono text-lg font-bold flex items-center">
                  {referralCode}
                </div>
                <Button
                  onClick={handleCopyCode}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Copy size={18} className="mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        {stats && (
          <section className="px-4 md:px-8 py-12 bg-secondary/10">
            <div className="max-w-6xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">Your Stats</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-muted-foreground text-sm mb-2">Total Referrals</p>
                  <p className="text-4xl font-bold text-primary">{stats.totalReferrals}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.activeReferrals} active
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-muted-foreground text-sm mb-2">Total Earned</p>
                  <p className="text-4xl font-bold text-green-500">${stats.totalEarned}</p>
                  <p className="text-xs text-muted-foreground mt-2">From referrals</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-muted-foreground text-sm mb-2">Bonus Per Referral</p>
                  <p className="text-4xl font-bold text-accent">$100</p>
                  <p className="text-xs text-muted-foreground mt-2">$50 for referee</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Apply Referral Code */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Have a Referral Code?</h2>
              <p className="text-muted-foreground mb-6">
                Enter a referral code to get your joining bonus!
              </p>
              <div className="flex gap-3">
                <Input
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  placeholder="Enter referral code..."
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyReferral}
                  disabled={applying || !referralInput}
                  className="bg-primary hover:bg-primary/90"
                >
                  {applying ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Share Your Code', desc: 'Send your referral code to friends' },
                { step: '2', title: 'They Join', desc: 'Your friends sign up with your code' },
                { step: '3', title: 'Earn Rewards', desc: 'Get $100 for each successful referral' },
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Referrals;
