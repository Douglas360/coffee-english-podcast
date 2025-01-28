import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select } from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

interface AIPostGeneratorProps {
  onPostGenerated: (post: {
    title: string;
    content: string;
    excerpt: string;
    metaDescription: string;
    imageUrl: string;
    slug: string;
    scheduledDate: string;
    suggestedKeywords: string[];
  }) => void;
}

export default function AIPostGenerator({ onPostGenerated }: AIPostGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [targetAudience, setTargetAudience] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-post', {
        body: { 
          topic,
          tone,
          length,
          targetAudience
        }
      });

      if (error) {
        throw error;
      }

      onPostGenerated({
        ...data,
        title: data.title || topic,
      });
      
    } catch (error: any) {
      console.error('Error generating post:', error);
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormItem>
        <FormLabel>Topic</FormLabel>
        <FormControl>
          <Input
            placeholder="Enter your post topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
        </FormControl>
        <FormDescription>
          The main subject of your blog post
        </FormDescription>
      </FormItem>

      <FormItem>
        <FormLabel>Tone of Voice</FormLabel>
        <FormControl>
          <select
            className="w-full p-2 border rounded"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isLoading}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="humorous">Humorous</option>
            <option value="formal">Formal</option>
          </select>
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Article Length</FormLabel>
        <FormControl>
          <select
            className="w-full p-2 border rounded"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            disabled={isLoading}
          >
            <option value="short">Short (~300 words)</option>
            <option value="medium">Medium (~600 words)</option>
            <option value="long">Long (~1000 words)</option>
          </select>
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Target Audience</FormLabel>
        <FormControl>
          <select
            className="w-full p-2 border rounded"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={isLoading}
          >
            <option value="general">General</option>
            <option value="beginners">Beginners</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="technical">Technical</option>
          </select>
        </FormControl>
      </FormItem>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate Post
      </Button>
    </form>
  );
}