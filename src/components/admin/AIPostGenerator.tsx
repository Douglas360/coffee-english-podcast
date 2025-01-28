import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      const response = await fetch('/api/generate-blog-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const data = await response.json();
      
      // Use the topic as the title
      onPostGenerated({
        ...data,
        title: topic,
      });
      
    } catch (error) {
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
      <div>
        <Input
          placeholder="Enter your post topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate Post
      </Button>
    </form>
  );
}