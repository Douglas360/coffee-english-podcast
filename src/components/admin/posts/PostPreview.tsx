import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "./PostForm";

interface PostPreviewProps {
  form: UseFormReturn<PostFormData>;
}

export const PostPreview = ({ form }: PostPreviewProps) => {
  return (
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
  );
};