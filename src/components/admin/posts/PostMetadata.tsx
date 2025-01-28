import React from 'react';
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "./PostForm";

interface PostMetadataProps {
  form: UseFormReturn<PostFormData>;
}

export const PostMetadata = ({ form }: PostMetadataProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};