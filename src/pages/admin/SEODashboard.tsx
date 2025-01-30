import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Search, 
  Link2, 
  FileText,
  AlertCircle
} from "lucide-react";

export default function SEODashboard() {
  const { data: keywords, isLoading: isLoadingKeywords } = useQuery({
    queryKey: ['seo-keywords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: clusters, isLoading: isLoadingClusters } = useQuery({
    queryKey: ['content-clusters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_clusters')
        .select(`
          *,
          posts (
            id,
            title,
            views_count,
            seo_score
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoadingKeywords || isLoadingClusters) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">SEO Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracked Keywords</p>
              <p className="text-2xl font-bold">{keywords?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Content Clusters</p>
              <p className="text-2xl font-bold">{clusters?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. SEO Score</p>
              <p className="text-2xl font-bold">
                {clusters?.reduce((acc, cluster) => {
                  const clusterScore = cluster.posts?.reduce((sum, post) => sum + (post.seo_score || 0), 0) || 0;
                  return acc + (clusterScore / (cluster.posts?.length || 1));
                }, 0) / (clusters?.length || 1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold">
                {clusters?.reduce((acc, cluster) => acc + (cluster.posts?.length || 0), 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Top Keywords</h2>
          <div className="space-y-4">
            {keywords?.slice(0, 5).map((keyword) => (
              <div key={keyword.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{keyword.keyword}</span>
                  <span className="text-sm text-gray-500">
                    Volume: {keyword.search_volume?.toLocaleString()}
                  </span>
                </div>
                <Progress value={keyword.difficulty_score} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Content Cluster Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clusters?.map(cluster => ({
                  name: cluster.name,
                  score: cluster.posts?.reduce((acc, post) => acc + (post.seo_score || 0), 0) / (cluster.posts?.length || 1)
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}