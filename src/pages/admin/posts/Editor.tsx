import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import AIPostGenerator from '@/components/admin/AIPostGenerator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Wand2 } from 'lucide-react';

type PostFormData = {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  scheduled_for: Date | null;
  status: 'draft' | 'published';
  featured_image: string | null;
};

type PostWithAnalytics = Tables<'posts'> & {
  post_analytics: Pick<Tables<'post_analytics'>, 
    'views' | 
    'unique_views' | 
    'avg_time_on_page' | 
    'bounce_rate' | 
    'created_at' | 
    'updated_at'
  > | null;
};

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const form = useForm<PostFormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: [],
      scheduled_for: null,
      status: 'draft',
      featured_image: null
    }
  });

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
      
      return {
        ...data,
        post_analytics: data.post_analytics?.[0] || null
      } as PostWithAnalytics;
    },
    enabled: isEditing
  });

  React.useEffect(() => {
    if (post) {
      form.reset({
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
      });
      setPreviewImage(post.featured_image);
    }
  }, [post]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      form.setValue('featured_image', publicUrl);
      setPreviewImage(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createPost = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (!session?.user?.id) {
        throw new Error('User must be logged in to create a post');
      }

      const { data: newPost, error } = await supabase
        .from('posts')
        .insert([{
          ...data,
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
      const { data: updatedPost, error } = await supabase
        .from('posts')
        .update({
          ...data,
          meta_keywords: data.meta_keywords,
          scheduled_for: data.scheduled_for?.toISOString(),
          featured_image: data.featured_image
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedPost;
    },
    onSuccess: () => {
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

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      updatePost.mutate(data);
    } else {
      createPost.mutate(data);
    }
  };

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
    form.setValue('title', generatedPost.title);
    form.setValue('content', generatedPost.content);
    form.setValue('excerpt', generatedPost.excerpt);
    form.setValue('meta_description', generatedPost.metaDescription);
    form.setValue('featured_image', generatedPost.imageUrl);
    form.setValue('slug', generatedPost.slug);
    form.setValue('scheduled_for', new Date(generatedPost.scheduledDate));
    form.setValue('meta_keywords', generatedPost.suggestedKeywords);
    
    setPreviewImage(generatedPost.imageUrl);
    
    toast({
      title: 'Post Generated',
      description: 'The AI-generated content has been added to the editor.',
    });
  };

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <MDEditor
                        value={field.value}
                        onChange={(value) => field.onChange(value || '')}
                        preview="edit"
                        previewOptions={{
                          rehypePlugins: [[rehypeSanitize]],
                        }}
                        height={400}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                        >
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="h-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                              <span className="mt-2 text-sm text-gray-500">
                                Click to upload image
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={60} />
                    </FormControl>
                    <div className="text-xs text-gray-500">
                      {field.value.length}/60 characters
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={160} />
                    </FormControl>
                    <div className="text-xs text-gray-500">
                      {field.value.length}/160 characters
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input 
                        value={field.value?.join(', ')} 
                        onChange={(e) => field.onChange(
                          e.target.value.split(',').map(k => k.trim())
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Google Search Preview</h3>
                <div className="max-w-2xl">
                  <div className="text-blue-800 text-xl hover:underline cursor-pointer">
                    {form.watch('meta_title') || form.watch('title')}
                  </div>
                  <div className="text-green-700 text-sm">
                    yourdomain.com/blog/{form.watch('slug')}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {form.watch('meta_description') || form.watch('excerpt')}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_for"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Publication</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full p-2 border rounded"
                        {...field}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}