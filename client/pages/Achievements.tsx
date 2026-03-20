import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Star } from 'lucide-react';

const Achievements = () => (
  <PlaceholderPage
    title="Achievements"
    description="Unlock achievements by completing challenges and reaching milestones. Collect badges and show off your accomplishments to the community."
    icon={<Star />}
    ctaText="Back to Home"
  />
);

export default Achievements;
