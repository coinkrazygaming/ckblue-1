import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { TrendingUp } from 'lucide-react';

const Referrals = () => (
  <PlaceholderPage
    title="Referral Program"
    description="Share your unique referral code with friends and earn generous bonuses when they join and play. Track your referral earnings and claims."
    icon={<TrendingUp />}
    ctaText="Back to Home"
  />
);

export default Referrals;
