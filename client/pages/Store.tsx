import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Gift, Loader, ShoppingCart } from 'lucide-react';
import { StoreItem } from '@shared/api';

const Store = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchStoreItems();
    fetchBalance();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const response = await fetch('/api/store');
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch store items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setBalance(data.wallet.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const handleBuyItem = async (itemId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setBuying(itemId);
    try {
      const response = await fetch('/api/store/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity: 1 }),
      });

      const data = await response.json();
      if (data.success) {
        setBalance(data.newBalance);
        alert('Item purchased successfully!');
        fetchStoreItems();
      } else {
        alert(data.error || 'Failed to purchase item');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Failed to purchase item');
    } finally {
      setBuying(null);
    }
  };

  const categories = Array.from(new Set(items.map(item => item.category)));
  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Gift size={32} className="text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Store</h1>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-6 py-3">
                <div className="text-sm text-muted-foreground">Available Balance</div>
                <div className="text-2xl font-bold text-primary">${balance.toFixed(2)}</div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Purchase cosmetics, boosts, and tools to enhance your gaming experience!
            </p>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="px-4 md:px-8 py-8 border-b border-border bg-secondary/20">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  All ({items.length})
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                    }`}
                  >
                    {category} ({items.filter(i => i.category === category).length})
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Items Grid */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-6xl border-b border-border">
                    {item.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mb-4 p-3 bg-secondary/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="text-xl font-bold text-primary">${item.price}</div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-muted-foreground capitalize bg-secondary/50 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-accent">
                        {item.quantity ? `${item.quantity} left` : 'Unlimited'}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleBuyItem(item.id)}
                      disabled={buying === item.id || balance < item.price}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {buying === item.id ? (
                        'Purchasing...'
                      ) : balance < item.price ? (
                        'Insufficient Balance'
                      ) : (
                        <>
                          <ShoppingCart size={18} className="mr-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Gift size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">No items in this category</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Store;
