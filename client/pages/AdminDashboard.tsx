import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support';
  lastLogin: string;
  status: 'active' | 'inactive';
}

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'moderator' | 'support'>('admin');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 1,
      email: 'admin@coinkrazy.com',
      name: 'Super Admin',
      role: 'super_admin',
      lastLogin: '2024-03-20 10:30 AM',
      status: 'active',
    },
    {
      id: 2,
      email: 'support@coinkrazy.com',
      name: 'Support Team',
      role: 'support',
      lastLogin: '2024-03-20 09:15 AM',
      status: 'active',
    },
  ]);

  const tabs: DashboardTab[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'admins', label: 'Admin Users', icon: <Users size={20} /> },
    { id: 'players', label: 'Player Management', icon: <Users size={20} /> },
    { id: 'games', label: 'Game Management', icon: <Settings size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ];

  const handleAddAdmin = () => {
    if (newAdminEmail && newAdminPassword) {
      const newAdmin: AdminUser = {
        id: Math.max(...adminUsers.map(a => a.id), 0) + 1,
        email: newAdminEmail,
        name: newAdminEmail.split('@')[0],
        role: newAdminRole,
        lastLogin: 'Never',
        status: 'active',
      };
      setAdminUsers([...adminUsers, newAdmin]);
      setNewAdminEmail('');
      setNewAdminPassword('');
      setShowAddAdminModal(false);
    }
  };

  const handleRemoveAdmin = (id: number) => {
    setAdminUsers(adminUsers.filter(a => a.id !== id));
  };

  const dashboardStats = [
    { label: 'Total Players', value: '12,456', icon: Users, color: 'text-primary' },
    { label: 'Active Sessions', value: '3,421', icon: TrendingUp, color: 'text-accent' },
    { label: 'Total Revenue', value: '$48,234', icon: TrendingUp, color: 'text-success' },
    { label: 'Pending Withdrawals', value: '42', icon: AlertCircle, color: 'text-warning' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header */}
        <div className="px-4 md:px-8 py-8 border-b border-border bg-secondary/20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform operations, players, and configurations</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 md:px-8 py-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* DASHBOARD OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Platform Overview</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {dashboardStats.map((stat, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <stat.icon size={32} className={`${stat.color} opacity-50`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Player Signup', user: 'john_doe', time: '5 minutes ago', icon: CheckCircle },
                        { action: 'Large Win', user: 'mega_win_42', time: '12 minutes ago', icon: TrendingUp },
                        { action: 'Withdrawal Request', user: 'lucky_player', time: '1 hour ago', icon: AlertCircle },
                        { action: 'Account Suspended', user: 'fraud_user', time: '2 hours ago', icon: XCircle },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                          <item.icon size={20} className="text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{item.action}</p>
                            <p className="text-xs text-muted-foreground">{item.user}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">System Health</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'API Servers', status: 'online', uptime: '99.98%' },
                        { name: 'Database', status: 'online', uptime: '99.95%' },
                        { name: 'Socket.io', status: 'online', uptime: '99.99%' },
                        { name: 'AI Services', status: 'online', uptime: '99.87%' },
                      ].map((service, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-success" />
                            <span className="text-sm text-foreground">{service.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{service.uptime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN USERS TAB */}
            {activeTab === 'admins' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Admin Users</h2>
                  <Button
                    onClick={() => setShowAddAdminModal(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Admin User
                  </Button>
                </div>

                {/* Add Admin Modal */}
                {showAddAdminModal && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
                      <h3 className="text-xl font-bold text-foreground mb-4">Add New Admin User</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                          <input
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="admin@coinkrazy.com"
                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                          <input
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder="Enter secure password"
                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                          <select
                            value={newAdminRole}
                            onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'moderator' | 'support')}
                            className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          >
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="support">Support</option>
                          </select>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleAddAdmin}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Add Admin
                          </Button>
                          <Button
                            onClick={() => setShowAddAdminModal(false)}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Users Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary/30 border-b border-border">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Login</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {adminUsers.map((admin) => (
                          <tr key={admin.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 text-sm text-foreground">{admin.email}</td>
                            <td className="px-6 py-4 text-sm text-foreground">{admin.name}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                {admin.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">{admin.lastLogin}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                admin.status === 'active'
                                  ? 'bg-success/20 text-success'
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {admin.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="p-2">
                                  <Eye size={16} />
                                </Button>
                                <Button size="sm" variant="outline" className="p-2">
                                  <Edit size={16} />
                                </Button>
                                {admin.role !== 'super_admin' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="p-2 text-destructive hover:text-destructive"
                                    onClick={() => handleRemoveAdmin(admin.id)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYERS TAB */}
            {activeTab === 'players' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Player Management</h2>
                  <div className="flex gap-2">
                    <div className="relative flex-1 md:flex-none">
                      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search players..."
                        className="bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <Users size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Player management interface coming soon</p>
                </div>
              </div>
            )}

            {/* GAMES TAB */}
            {activeTab === 'games' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Game Management</h2>
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <Settings size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Game management interface coming soon</p>
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Analytics & Reports</h2>
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <BarChart3 size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
