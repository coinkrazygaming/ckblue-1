import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Gift } from 'lucide-react';

const Store = () => (
  <PlaceholderPage
    title="Gold Coin Store"
    description="Purchase Gold Coins to play your favorite games. Choose from various packages with bonus offers and special promotions."
    icon={<Gift />}
    ctaText="Back to Home"
  />
);

export default Store;
