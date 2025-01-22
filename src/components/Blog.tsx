import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarIcon, Clock } from "lucide-react";

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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Blog: Tips for learning English
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  {post.categories?.name && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                      {post.categories.name}
                    </span>
                  )}
                  {post.reading_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time} min</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(post.published_at).toLocaleDateString('pt-BR')}
                  </div>
                  <Button variant="outline">Ler mais</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};