import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Star,
  Gift,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Coins,
  Users,
  Zap,
  Crown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home', section: 'main' },
    { path: '/games', icon: Gamepad2, label: 'Games', section: 'games' },
    { path: '/leaderboards', icon: Trophy, label: 'Leaderboards', section: 'social' },
    { path: '/achievements', icon: Star, label: 'Achievements', section: 'social' },
    { path: '/challenges', icon: Zap, label: 'Challenges', section: 'social' },
    { path: '/store', icon: Gift, label: 'Store', section: 'main' },
    { path: '/community', icon: Users, label: 'Community', section: 'social' },
    { path: '/vip', icon: Crown, label: 'VIP Club', section: 'social' },
    { path: '/wallet', icon: Coins, label: 'Wallet', section: 'account' },
    { path: '/referrals', icon: TrendingUp, label: 'Referrals', section: 'account' },
  ];

  const accountItems = [
    { path: '/profile', icon: Settings, label: 'Profile', section: 'account' },
    { path: '/support', icon: MessageCircle, label: 'Support', section: 'account' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-card border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground">CoinKrazy</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-secondary rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-30 md:relative md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-4 mb-8 hidden md:flex"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Coins className="w-7 h-7 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-sidebar-foreground">CoinKrazy</span>
              <span className="text-xs text-sidebar-accent-foreground">AI</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                  isActive(item.path)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}

            <div className="my-6 border-t border-sidebar-border" />

            {accountItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                  isActive(item.path)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-sidebar-foreground">Player123</div>
                <div className="text-xs text-sidebar-accent-foreground">Level 42</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-bold">
                P
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                // Handle logout
                setMobileMenuOpen(false);
              }}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden mt-16 md:mt-0">
        {/* Header - Desktop only */}
        <header className="hidden md:flex items-center justify-between h-16 px-6 bg-card border-b border-border">
          <div className="flex-1">
            {/* Breadcrumb or page title would go here */}
          </div>
          <div className="flex items-center gap-4">
            {/* Balance Display */}
            <div className="flex items-center gap-4 bg-secondary px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Gold Coins</span>
                  <span className="text-sm font-bold text-foreground">5,234</span>
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Sweeps Coins</span>
                  <span className="text-sm font-bold text-foreground">$234.56</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile overlay when menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
