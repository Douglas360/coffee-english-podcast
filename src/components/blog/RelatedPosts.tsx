
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  slug: string;
  views_count: number;
  categories: {
    name: string;
  };
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in delay-400">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Related Posts</h3>
      <div className="space-y-6">
        {posts?.length === 0 ? (
          <p className="text-gray-500 italic">No related posts found</p>
        ) : (
          posts?.map((relatedPost) => (
            <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                {relatedPost.featured_image && (
                  <img
                    src={relatedPost.featured_image}
                    alt={relatedPost.title}
                    className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h4>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {relatedPost.categories?.name && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {relatedPost.categories.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {relatedPost.views_count || 0}
                      </span>
                    </div>
                    <span>
                      {format(new Date(relatedPost.published_at), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
