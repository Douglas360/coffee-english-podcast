
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MessageSquare } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import PostHero from '@/components/blog/PostHero';
import PostAuthor from '@/components/blog/PostAuthor';
import PostShare from '@/components/blog/PostShare';
import RelatedPosts from '@/components/blog/RelatedPosts';

export default function BlogPost() {
  const { slug } = useParams();

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
    queryKey: ['related-posts', post?.category_id],
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
          categories (
            name
          )
        `)
        .eq('category_id', post.category_id)
        .eq('status', 'published')
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!post?.category_id,
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
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground bg-white px-4 py-2 rounded-lg shadow-sm mb-8 animate-fade-in">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-primary hover:text-primary/80">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog" className="text-primary hover:text-primary/80">
                Blog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-gray-800 font-semibold">{post.title}</span>
            </BreadcrumbItem>
          </Breadcrumb>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <PostAuthor 
              author={post.author}
              publishedAt={post.published_at}
              createdAt={post.created_at}
              readingTime={post.reading_time?.toString()}
            />

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
              <p className="text-gray-500">Comments coming soon...</p>
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
