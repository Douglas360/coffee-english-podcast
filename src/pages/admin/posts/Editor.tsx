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
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
};

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

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
      status: 'draft'
    }
  });

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Tables<'posts'>;
    },
    enabled: isEditing
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
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
        status: post.status as 'draft' | 'published' || 'draft'
      });
    }
  }, [post]);

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
    onError: (error) => {
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
    onError: (error) => {
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Post' : 'New Post'}
        </h1>
        <Button onClick={() => navigate('/admin/posts')}>
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
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
                      <textarea 
                        className="w-full min-h-[400px] p-4 rounded-md border"
                        {...field} 
                      />
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
                      <Input {...field} />
                    </FormControl>
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
                      <Input {...field} />
                    </FormControl>
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