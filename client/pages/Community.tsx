import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Users } from 'lucide-react';

const Community = () => (
  <PlaceholderPage
    title="Community"
    description="Connect with other players, join social groups, share achievements, and participate in community events and tournaments."
    icon={<Users />}
    ctaText="Back to Home"
  />
);

export default Community;
