
import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostShareProps {
  url: string;
  title: string;
}

export default function PostShare({ url, title }: PostShareProps) {
  const encodedTitle = encodeURIComponent(title);
  
  return (
    <div className="flex items-center gap-4 mb-12 animate-fade-up delay-200">
      <span className="font-semibold">Share:</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${url}`, '_blank')}
        className="hover:scale-105 transition-transform"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${url}`, '_blank')}
        className="hover:scale-105 transition-transform"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedTitle}`, '_blank')}
        className="hover:scale-105 transition-transform"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  );
}
