import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaLink?: string;
  ctaText?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon,
  ctaLink = '/',
  ctaText = 'Back to Home',
}) => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-8">
            <div className="text-6xl md:text-8xl opacity-50">
              {icon}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {description}
          </p>
          <Link to={ctaLink}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {ctaText} <ChevronRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
