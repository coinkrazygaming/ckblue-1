import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { MessageCircle } from 'lucide-react';

const Support = () => (
  <PlaceholderPage
    title="Customer Support"
    description="Get help from our support team. Submit support tickets, chat with our AI assistant, or browse our FAQ for quick answers to common questions."
    icon={<MessageCircle />}
    ctaText="Back to Home"
  />
);

export default Support;
