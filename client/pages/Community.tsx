import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Heart, Loader, MessageCircle } from 'lucide-react';
import { CommunityPost } from '@shared/api';

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/posts?limit=50');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setPosting(true);
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateDialog(false);
        setTitle('');
        setContent('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/community/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to like post:', error);
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
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users size={32} className="text-primary" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Community</h1>
                <p className="text-lg text-muted-foreground">Connect with other players</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Create Post
            </Button>
          </div>
        </section>

        {/* Posts Feed */}
        <section className="px-4 md:px-8 py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-2">{post.title}</h3>
                    <p className="text-muted-foreground">{post.content}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart size={18} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">No posts yet. Be the first to post!</p>
              </div>
            )}
          </div>
        </section>

        {/* Create Post Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="mt-2 min-h-24"
                />
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={posting || !title || !content}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {posting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Community;
