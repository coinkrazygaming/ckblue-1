import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Trophy } from 'lucide-react';

const Leaderboards = () => (
  <PlaceholderPage
    title="Leaderboards"
    description="View rankings, compete with other players, and climb the weekly, monthly, and all-time leaderboards. Track your position and earn exclusive rewards based on your rank."
    icon={<Trophy />}
    ctaText="Back to Home"
  />
);

export default Leaderboards;
