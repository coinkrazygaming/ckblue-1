import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Settings } from 'lucide-react';

const Profile = () => (
  <PlaceholderPage
    title="Player Profile"
    description="Manage your account settings, update your profile information, view your gaming statistics, and customize your preferences."
    icon={<Settings />}
    ctaText="Back to Home"
  />
);

export default Profile;
