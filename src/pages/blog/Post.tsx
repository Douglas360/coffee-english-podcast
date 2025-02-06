import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { CalendarIcon, Clock, Facebook, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  slug: string;
  categories: {
    name: string;
  };
}

export default function BlogPost() {
  const { slug } = useParams();

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
      return data as RelatedPost[];
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
  const shareText = encodeURIComponent(post.title);

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Featured Image */}
      <div className="relative h-[60vh] min-h-[400px] animate-fade-in">
        <img
          src={post.featured_image || '/placeholder.svg'}
          alt={post.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-up delay-100">{post.excerpt}</p>
            )}
          </div>
        </div>
      </div>

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
            {/* Author and Meta Info */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm animate-fade-up">
              <Avatar>
                <AvatarImage src={post.author?.avatar_url} />
                <AvatarFallback>{post.author?.full_name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.author?.full_name || 'Anonymous'}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {format(new Date(post.published_at || post.created_at), 'dd MMM yyyy')}
                  </span>
                  {post.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.reading_time} min read
                    </span>
                  )}
                </div>
              </div>
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

            {/* Social Share */}
            <div className="flex items-center gap-4 mb-12 animate-fade-up delay-200">
              <span className="font-semibold">Share:</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
                className="hover:scale-105 transition-transform"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank')}
                className="hover:scale-105 transition-transform"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`, '_blank')}
                className="hover:scale-105 transition-transform"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>

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
            {/* Related Posts */}
            <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in delay-400">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Related Posts</h3>
              <div className="space-y-6">
                {relatedPosts?.length === 0 ? (
                  <p className="text-gray-500 italic">No related posts found</p>
                ) : (
                  relatedPosts?.map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                        {relatedPost.featured_image && (
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                          {relatedPost.excerpt && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            {relatedPost.categories?.name && (
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                {relatedPost.categories.name}
                              </span>
                            )}
                            <span>
                              {format(new Date(relatedPost.published_at), 'dd MMM yyyy')}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
