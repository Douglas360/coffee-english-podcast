import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Settings, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export default function AdminIndex() {
  const navigate = useNavigate();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Tables<'posts'>[];
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Admin</h1>
        <Button onClick={() => navigate('/admin/posts/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Posts</h2>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{posts?.length || 0}</p>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => navigate('/admin/posts')}
          >
            Manage Posts
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Configure blog settings and SEO defaults
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/admin/settings')}
          >
            Open Settings
          </Button>
        </div>
      </div>
    </div>
  );
}