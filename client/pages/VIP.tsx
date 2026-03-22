import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Crown, Loader, Zap, Gift } from 'lucide-react';
import { VIPMembership } from '@shared/api';

const VIP = () => {
  const [membership, setMembership] = useState<VIPMembership | null>(null);
  const [tiers, setTiers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const TIER_COLORS = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-yellow-400 to-yellow-500',
    platinum: 'from-purple-400 to-purple-500',
  };

  useEffect(() => {
    fetchVIPInfo();
  }, []);

  const fetchVIPInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/vip', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMembership(data.membership);
        setTiers(data.tiers);
      }
    } catch (error) {
      console.error('Failed to fetch VIP info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setUpgrading(tier);
    try {
      const response = await fetch('/api/vip/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();
      if (data.success) {
        setMembership(data.membership);
        alert(`Upgraded to VIP ${tier}!`);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setUpgrading(null);
    }
  };

  const handleClaimBonus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/vip/claim-bonus', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        alert(`Claimed ${data.bonusAmount} coins!`);
        fetchVIPInfo();
      }
    } catch (error) {
      console.error('Claim failed:', error);
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
              <Crown size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">VIP Club</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Join our exclusive VIP club for premium benefits and rewards!
            </p>
          </div>
        </section>

        {/* Current Membership */}
        {membership && membership.isActive && (
          <section className="px-4 md:px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <div className={`bg-gradient-to-br ${TIER_COLORS[membership.tier as keyof typeof TIER_COLORS]} rounded-lg p-8 text-white mb-12`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold opacity-90 mb-2">Current VIP Tier</p>
                    <h2 className="text-4xl font-bold capitalize">{membership.tier}</h2>
                  </div>
                  <Crown size={64} className="opacity-20" />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-sm opacity-90">Bonus Multiplier</p>
                    <p className="text-3xl font-bold">{membership.bonusMultiplier}x</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Monthly Bonus</p>
                    <p className="text-3xl font-bold">${membership.monthlyBonus}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Expires</p>
                    <p className="text-3xl font-bold">
                      {new Date(membership.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleClaimBonus}
                  className="bg-white text-foreground hover:bg-white/90"
                >
                  <Gift className="mr-2" size={18} />
                  Claim Monthly Bonus
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Tier Cards */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">VIP Tiers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers &&
                Object.entries(tiers).map(([tierName, tierData]: any) => (
                  <div key={tierName} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
                    <div className={`bg-gradient-to-br ${TIER_COLORS[tierName as keyof typeof TIER_COLORS]} p-6 text-white`}>
                      <h3 className="text-2xl font-bold capitalize mb-4">{tierName}</h3>
                      <div className="text-3xl font-bold mb-2">${tierData.cost}</div>
                      <p className="text-sm opacity-90">{tierData.durationDays} days</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bonus Multiplier</p>
                        <p className="text-lg font-bold text-primary">{tierData.bonusMultiplier}x</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Bonus</p>
                        <p className="text-lg font-bold text-accent">${tierData.monthlyBonus}</p>
                      </div>
                      <Button
                        onClick={() => handleUpgrade(tierName)}
                        disabled={upgrading === tierName}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {upgrading === tierName ? 'Upgrading...' : 'Upgrade'}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">VIP Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: <Zap size={24} />, title: 'Bonus Multiplier', desc: 'Increase your winnings with bonus multipliers' },
                { icon: <Gift size={24} />, title: 'Monthly Bonus', desc: 'Get exclusive monthly bonuses deposited to your account' },
                { icon: '🎁', title: 'Exclusive Items', desc: 'Access to VIP-only cosmetics and items' },
                { icon: '👑', title: 'Priority Support', desc: 'Get priority customer support' },
              ].map((benefit, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <div className="text-4xl mb-4 text-primary">{typeof benefit.icon === 'string' ? benefit.icon : benefit.icon}</div>
                  <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default VIP;
