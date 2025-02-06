
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Author {
  avatar_url?: string;
  full_name?: string;
}

interface PostAuthorProps {
  author: Author;
  publishedAt: string;
  createdAt: string;
  readingTime?: string;
}

export default function PostAuthor({ author, publishedAt, createdAt, readingTime }: PostAuthorProps) {
  return (
    <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm animate-fade-up">
      <Avatar>
        <AvatarImage src={author?.avatar_url} />
        <AvatarFallback>{author?.full_name?.[0] || 'A'}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{author?.full_name || 'Anonymous'}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {format(new Date(publishedAt || createdAt), 'dd MMM yyyy')}
          </span>
          {readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
