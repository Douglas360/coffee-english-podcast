
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function BlogIndex() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["all-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          reading_time,
          published_at,
          slug,
          categories (
            name
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] bg-gradient-to-r from-primary/90 to-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6 animate-fade-up">
            Blog: Tips for Learning English
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto animate-fade-up delay-100">
            Discover effective strategies, practical tips, and expert insights to master the English language.
          </p>
        </div>
      </div>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts?.map((post, index) => (
            <Card
              key={post.id}
              className="overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 bg-white animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}>
              {post.featured_image && (
                <div className="relative group">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  {post.categories?.name && (
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full uppercase font-semibold">
                      {post.categories.name}
                    </span>
                  )}
                  {post.reading_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{post.reading_time} min</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1 text-primary" />
                    {post.published_at ? format(new Date(post.published_at), 'dd MMM yyyy') : 'Not published'}
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <Button 
                      variant="outline" 
                      className="hover:bg-primary hover:text-white transition-all hover:scale-105"
                    >
                      Read more
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
