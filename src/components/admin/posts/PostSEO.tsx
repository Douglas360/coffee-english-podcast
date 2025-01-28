import React from 'react';
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "./PostForm";

interface PostSEOProps {
  form: UseFormReturn<PostFormData>;
}

export const PostSEO = ({ form }: PostSEOProps) => {
  return (
    <div className="space-y-4">
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
              {field.value?.length || 0}/60 characters
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
              {field.value?.length || 0}/160 characters
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
    </div>
  );
};