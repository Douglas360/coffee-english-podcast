import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, TrendingUp, Tag, FileText, Link2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SEOAnalysisProps {
  postId: string;
  content: string;
  title: string;
  metaDescription: string;
  keywords: string[];
}

export const SEOAnalysis = ({ postId, content, title, metaDescription, keywords }: SEOAnalysisProps) => {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['seo-analysis', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_analysis')
        .select('*')
        .eq('post_id', postId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateKeywordDensity = (text: string, keyword: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word === keyword.toLowerCase()).length;
    return (keywordCount / words.length) * 100;
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading analysis...</div>;
  }

  const keywordDensity = keywords.length > 0 
    ? calculateKeywordDensity(content, keywords[0])
    : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          SEO Score Overview
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Overall Score</span>
              <span className={getScoreColor(analysis?.readability_score || 0)}>
                {analysis?.readability_score || 0}%
              </span>
            </div>
            <Progress value={analysis?.readability_score || 0} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Keyword Density: {keywordDensity.toFixed(2)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Content Length: {content.split(/\s+/).length} words</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span>Internal Links: {analysis?.internal_links_count || 0}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Optimization Checklist</h3>
        <div className="space-y-3">
          {[
            {
              check: title.length >= 40 && title.length <= 60,
              label: 'Title length (40-60 characters)',
              current: `${title.length} characters`
            },
            {
              check: metaDescription.length >= 120 && metaDescription.length <= 160,
              label: 'Meta description length (120-160 characters)',
              current: `${metaDescription.length} characters`
            },
            {
              check: keywords.length >= 3,
              label: 'Keywords defined',
              current: `${keywords.length} keywords`
            },
            {
              check: content.split(/\s+/).length >= 300,
              label: 'Minimum content length (300 words)',
              current: `${content.split(/\s+/).length} words`
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.check ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <span>{item.label}</span>
              </div>
              <span className="text-sm text-gray-500">{item.current}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};