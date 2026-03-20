import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Crown } from 'lucide-react';

const VIP = () => (
  <PlaceholderPage
    title="VIP Club"
    description="Join our exclusive VIP club for premium benefits, higher win rates, priority support, and exclusive game access. Tier up with higher spending and enjoy VIP privileges."
    icon={<Crown />}
    ctaText="Back to Home"
  />
);

export default VIP;
