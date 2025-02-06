
import React from 'react';

interface PostHeroProps {
  title: string;
  excerpt?: string;
  featuredImage: string;
}

export default function PostHero({ title, excerpt, featuredImage }: PostHeroProps) {
  return (
    <div className="relative h-[60vh] min-h-[400px] animate-fade-in">
      <img
        src={featuredImage || '/placeholder.svg'}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-up">{title}</h1>
          {excerpt && (
            <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-up delay-100">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
