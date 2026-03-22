import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle, Loader, MessageSquare } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

const Support = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const faqRes = await fetch('/api/support/faq');
      const faqData = await faqRes.json();
      if (faqData.success) {
        setFaqs(faqData.faq);
      }

      const token = localStorage.getItem('token');
      if (token) {
        const ticketsRes = await fetch('/api/support/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ticketsData = await ticketsRes.json();
        if (ticketsData.success) {
          setTickets(ticketsData.tickets);
        }
      }
    } catch (error) {
      console.error('Failed to fetch support data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setCreating(true);
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message, category, priority }),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateDialog(false);
        setSubject('');
        setMessage('');
        setCategory('general');
        setPriority('normal');
        fetchData();
        alert('Support ticket created successfully!');
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreating(false);
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

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Header */}
        <section className="px-4 md:px-8 py-8 md:py-12 border-b border-border">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle size={32} className="text-primary" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Support</h1>
                <p className="text-lg text-muted-foreground">How can we help you today?</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <MessageSquare size={18} />
              Create Ticket
            </Button>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>

            {categories.map(cat => (
              <div key={cat} className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 capitalize">{cat}</h3>
                <Accordion type="single" collapsible className="bg-card border border-border rounded-lg">
                  {faqs
                    .filter(f => f.category === cat)
                    .map((faq, idx) => (
                      <AccordionItem key={faq.id} value={faq.id} className={idx === 0 ? '' : 'border-t border-border'}>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
                          <span className="text-left font-semibold text-foreground">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Support Tickets */}
        {tickets.length > 0 && (
          <section className="px-4 md:px-8 py-12 bg-secondary/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">My Support Tickets</h2>
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground">{ticket.message}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                          ticket.status === 'resolved'
                            ? 'bg-green-500/20 text-green-500'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Create Ticket Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="general">General</option>
                  <option value="bug">Bug Report</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="payment">Payment Issue</option>
                  <option value="account">Account Issue</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="mt-2 min-h-24"
                />
              </div>
              <Button
                onClick={handleCreateTicket}
                disabled={creating || !subject || !message}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {creating ? 'Creating...' : 'Create Ticket'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Support;
