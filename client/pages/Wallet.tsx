import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coins, ArrowUpRight, ArrowDownLeft, Loader } from 'lucide-react';
import { Wallet, WalletTransaction } from '@shared/api';

const WalletPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState('100');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const walletResponse = await fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const walletData = await walletResponse.json();
      if (walletData.success) {
        setWallet(walletData.wallet);
      }

      const transResponse = await fetch('/api/wallet/transactions?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transData = await transResponse.json();
      if (transData.success) {
        setTransactions(transData.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(depositAmount) }),
      });

      const data = await response.json();
      if (data.success) {
        setWallet(data.wallet);
        setShowDepositDialog(false);
        setDepositAmount('100');
        fetchWalletData();
      }
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) }),
      });

      const data = await response.json();
      if (data.success) {
        setWallet(data.wallet);
        setShowWithdrawDialog(false);
        setWithdrawAmount('100');
        fetchWalletData();
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header */}
        <section className="px-4 md:px-8 py-8 md:py-12 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Coins size={32} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Wallet</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage your account balance and view transaction history
            </p>
          </div>
        </section>

        {/* Balance Cards */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-8 text-white mb-8">
              <p className="text-sm font-semibold opacity-90 mb-2">Current Balance</p>
              <h2 className="text-5xl font-bold mb-8">${wallet?.balance.toFixed(2) || '0.00'}</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-sm opacity-90">Total Earned</p>
                  <p className="text-2xl font-bold">${wallet?.totalEarned.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Spent</p>
                  <p className="text-2xl font-bold">${wallet?.totalSpent.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowDepositDialog(true)}
                  className="flex-1 bg-white text-primary hover:bg-white/90"
                >
                  <ArrowDownLeft className="mr-2" size={18} />
                  Deposit
                </Button>
                <Button
                  onClick={() => setShowWithdrawDialog(true)}
                  variant="outline"
                  className="flex-1 border-white text-white hover:bg-white/10"
                >
                  <ArrowUpRight className="mr-2" size={18} />
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions History */}
        <section className="px-4 md:px-8 py-12 bg-secondary/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Transaction History</h2>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Type</th>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Description</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {transaction.amount > 0 ? (
                                <ArrowDownLeft size={18} className="text-green-500" />
                              ) : (
                                <ArrowUpRight size={18} className="text-red-500" />
                              )}
                              <span className="text-sm font-semibold capitalize">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {transaction.description}
                          </td>
                          <td className={`px-6 py-4 text-right font-semibold ${
                            transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''} ${Math.abs(transaction.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Deposit Dialog */}
        <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="10"
                    placeholder="Enter amount"
                    className="flex-1"
                  />
                  <span className="text-muted-foreground py-2">$</span>
                </div>
              </div>
              <Button
                onClick={handleDeposit}
                disabled={processing}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {processing ? 'Processing...' : 'Deposit'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Withdraw Dialog */}
        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="10"
                    max={wallet?.balance || 0}
                    placeholder="Enter amount"
                    className="flex-1"
                  />
                  <span className="text-muted-foreground py-2">$</span>
                </div>
                {wallet && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ${wallet.balance.toFixed(2)}
                  </p>
                )}
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={processing}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {processing ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default WalletPage;
