
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MessageSquare, ThumbsUp, HomeIcon, ChevronRight } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import PostHero from '@/components/blog/PostHero';
import PostAuthor from '@/components/blog/PostAuthor';
import PostShare from '@/components/blog/PostShare';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();

  // Fetch post data
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            username,
            avatar_url,
            full_name
          ),
          categories (
            name
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Handle like post
  const handleLike = async () => {
    if (!post?.id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Você precisa estar logado para curtir posts.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: post.id,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Post curtido!",
        description: "Obrigado por seu feedback!",
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Erro ao curtir o post",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  // Increment view count when post is loaded
  useEffect(() => {
    const incrementViews = async () => {
      if (post?.id) {
        const { error } = await supabase.rpc('increment_post_views', {
          post_id: post.id
        });
        
        if (error) {
          console.error('Error incrementing views:', error);
        }
      }
    };

    incrementViews();
  }, [post?.id]);

  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', post?.id],
    queryFn: async () => {
      if (!post?.category_id) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          published_at,
          slug,
          views_count,
          categories (
            name
          )
        `)
        .eq('category_id', post.category_id)
        .eq('status', 'published')
        .neq('id', post.id)
        .order('views_count', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!post?.id,
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  const shareUrl = window.location.href;

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PostHero 
        title={post.title}
        excerpt={post.excerpt}
        featuredImage={post.featured_image}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground bg-white px-4 py-3 rounded-lg shadow-sm mb-8 animate-fade-in hover:shadow-md transition-shadow">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-primary hover:text-primary/80 flex items-center gap-1">
                  <HomeIcon className="w-4 h-4" />
                  <span>Início</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog" className="text-primary hover:text-primary/80 font-medium">
                  Blog
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-gray-800 font-semibold">{post.title}</span>
            </BreadcrumbItem>
          </Breadcrumb>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <PostAuthor 
                author={post.author}
                publishedAt={post.published_at}
                createdAt={post.created_at}
                readingTime={post.reading_time?.toString()}
              />
              
              {/* Like Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className="flex items-center gap-2 hover:bg-primary/5"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes_count || 0}</span>
              </Button>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12 bg-white rounded-lg shadow-sm p-8 animate-fade-up delay-100">
              <div data-color-mode="light">
                <MDEditor.Markdown 
                  source={post.content} 
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#374151'
                  }}
                  className="markdown-content"
                />
              </div>
            </div>

            <PostShare url={shareUrl} title={post.title} />

            {/* Comments Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-up delay-300">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Comments
              </h3>
              <p className="text-gray-500">Coming soon..</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <RelatedPosts posts={relatedPosts || []} />
          </aside>
        </div>
      </div>
    </article>
  );
}
