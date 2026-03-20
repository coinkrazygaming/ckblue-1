import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Coins } from 'lucide-react';

const Wallet = () => (
  <PlaceholderPage
    title="Wallet & Balance"
    description="Manage your Gold Coins and Sweeps Coins, view transaction history, and track your winnings and purchases."
    icon={<Coins />}
    ctaText="Back to Home"
  />
);

export default Wallet;
