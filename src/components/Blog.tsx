import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
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
          categories (
            name
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(6);

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
    <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800">
          Blog: Tips for Learning English
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts?.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
              {post.featured_image && (
                <div className="relative group">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
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

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1 text-primary" />
                    {post.published_at ? format(new Date(post.published_at), 'dd MMM yyyy') : 'Not published'}
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="outline" className="hover:bg-primary hover:text-white transition-all">
                      Ler mais
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};