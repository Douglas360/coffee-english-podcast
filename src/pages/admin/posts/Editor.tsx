import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AIPostGenerator from '@/components/admin/AIPostGenerator';
import { PostForm, PostFormData } from "@/components/admin/posts/PostForm";

type PostAnalytics = Pick<Tables<'post_analytics'>, 
  'views' | 
  'unique_views' | 
  'avg_time_on_page' | 
  'bounce_rate' | 
  'created_at' | 
  'updated_at'
>;

type PostWithAnalytics = Tables<'posts'> & {
  post_analytics: PostAnalytics | null;
};

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_analytics (
            views,
            unique_views,
            avg_time_on_page,
            bounce_rate,
            created_at,
            updated_at
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as PostWithAnalytics;
    },
    enabled: isEditing
  });

  const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', baseSlug)
      .single();

    if (!existingPost || (isEditing && existingPost.id === id)) {
      return baseSlug;
    }

    const timestamp = new Date().getTime();
    return `${baseSlug}-${timestamp}`;
  };

  const createPost = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (!session?.user?.id) {
        throw new Error('User must be logged in to create a post');
      }

      const uniqueSlug = await generateUniqueSlug(data.slug);

      const { data: newPost, error } = await supabase
        .from('posts')
        .insert([{
          ...data,
          slug: uniqueSlug,
          author_id: session.user.id,
          meta_keywords: data.meta_keywords,
          scheduled_for: data.scheduled_for?.toISOString(),
          featured_image: data.featured_image
        }])
        .select()
        .single();
      
      if (error) throw error;
      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      navigate('/admin/posts');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updatePost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const uniqueSlug = await generateUniqueSlug(data.slug);

      const { data: updatedPost, error } = await supabase
        .from('posts')
        .update({
          ...data,
          slug: uniqueSlug,
          meta_keywords: data.meta_keywords,
          scheduled_for: data.scheduled_for?.toISOString(),
          featured_image: data.featured_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      navigate('/admin/posts');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAIGenerated = (generatedPost: {
    title: string;
    content: string;
    excerpt: string;
    metaDescription: string;
    imageUrl: string;
    slug: string;
    scheduledDate: string;
    suggestedKeywords: string[];
  }) => {
    const formData: PostFormData = {
      title: generatedPost.title,
      content: generatedPost.content,
      excerpt: generatedPost.excerpt,
      meta_description: generatedPost.metaDescription,
      featured_image: generatedPost.imageUrl,
      slug: generatedPost.slug,
      scheduled_for: new Date(generatedPost.scheduledDate),
      meta_keywords: generatedPost.suggestedKeywords,
      status: 'draft',
      meta_title: generatedPost.title
    };
    
    if (isEditing) {
      updatePost.mutate(formData);
    } else {
      createPost.mutate(formData);
    }
    
    toast({
      title: 'Post Generated',
      description: 'The AI-generated content has been added to the editor.',
    });
  };

  const defaultValues = post ? {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    slug: post.slug,
    meta_title: post.meta_title || "",
    meta_description: post.meta_description || "",
    meta_keywords: post.meta_keywords || [],
    scheduled_for: post.scheduled_for ? new Date(post.scheduled_for) : null,
    status: post.status as 'draft' | 'published' || 'draft',
    featured_image: post.featured_image
  } : undefined;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wand2 className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Generate Post with AI</h2>
                <AIPostGenerator onPostGenerated={handleAIGenerated} />
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => navigate('/admin/posts')}>
            Cancel
          </Button>
        </div>
      </div>

      {post && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Post Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Views</p>
              <p className="text-2xl font-bold">{post.post_analytics?.views || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Views</p>
              <p className="text-2xl font-bold">{post.post_analytics?.unique_views || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">SEO Score</p>
              <p className="text-2xl font-bold">{post.seo_score || 0}%</p>
            </div>
          </div>
        </div>
      )}

      <PostForm
        defaultValues={defaultValues}
        onSubmit={isEditing ? updatePost.mutate : createPost.mutate}
        isLoading={isLoadingPost || createPost.isPending || updatePost.isPending}
      />
    </div>
  );
}