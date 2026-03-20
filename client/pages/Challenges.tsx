import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Zap } from 'lucide-react';

const Challenges = () => (
  <PlaceholderPage
    title="Daily & Weekly Challenges"
    description="Complete daily and weekly challenges to earn bonus rewards. Track your progress and claim prizes as you reach milestones."
    icon={<Zap />}
    ctaText="Back to Home"
  />
);

export default Challenges;
