import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { LayoutDashboard } from 'lucide-react';

const Admin = () => (
  <PlaceholderPage
    title="Admin Dashboard"
    description="Administrative control panel for managing players, games, financial operations, analytics, and AI agent duties. Restricted to admin users only."
    icon={<LayoutDashboard />}
    ctaText="Back to Home"
  />
);

export default Admin;
