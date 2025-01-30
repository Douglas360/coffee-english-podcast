import React from "react";
import { useForm } from "react-hook-form";
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
import { Save } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import { ImageUpload } from "./ImageUpload";
import { PostMetadata } from "./PostMetadata";
import { PostScheduling } from "./PostScheduling";
import { PostSEO } from "./PostSEO";
import { PostPreview } from "./PostPreview";
import { SEOAnalysis } from "./SEOAnalysis";

export type PostFormData = {
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

interface PostFormProps {
  defaultValues?: PostFormData;
  onSubmit: (data: PostFormData) => void;
  isLoading?: boolean;
}

export const PostForm = ({ defaultValues, onSubmit, isLoading }: PostFormProps) => {
  const form = useForm<PostFormData>({
    defaultValues: defaultValues || {
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

  const watchContent = form.watch('content');
  const watchTitle = form.watch('title');
  const watchMetaDescription = form.watch('meta_description');
  const watchMetaKeywords = form.watch('meta_keywords');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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

            <ImageUpload
              previewImage={form.watch('featured_image')}
              onImageUploaded={(url) => form.setValue('featured_image', url)}
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

            <PostMetadata form={form} />
            <PostScheduling form={form} />
            <PostSEO form={form} />
            <PostPreview form={form} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SEOAnalysis
                postId={defaultValues?.slug || ''}
                content={watchContent}
                title={watchTitle}
                metaDescription={watchMetaDescription}
                keywords={watchMetaKeywords}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Post
          </Button>
        </div>
      </form>
    </Form>
  );
};