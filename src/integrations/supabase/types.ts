export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      backlinks: {
        Row: {
          domain_authority: number | null
          first_seen_at: string | null
          id: string
          last_checked_at: string | null
          source_url: string
          status: string | null
          target_url: string
        }
        Insert: {
          domain_authority?: number | null
          first_seen_at?: string | null
          id?: string
          last_checked_at?: string | null
          source_url: string
          status?: string | null
          target_url: string
        }
        Update: {
          domain_authority?: number | null
          first_seen_at?: string | null
          id?: string
          last_checked_at?: string | null
          source_url?: string
          status?: string | null
          target_url?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_clusters: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          main_keyword_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          main_keyword_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          main_keyword_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_clusters_main_keyword_id_fkey"
            columns: ["main_keyword_id"]
            isOneToOne: false
            referencedRelation: "seo_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      event_notifications: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          message_template: string
          notification_type: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message_template: string
          notification_type: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message_template?: string
          notification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          error_message: string | null
          event_id: string | null
          id: string
          notification_type: string
          sent_at: string | null
          status: string
          subscriber_id: string | null
        }
        Insert: {
          error_message?: string | null
          event_id?: string | null
          id?: string
          notification_type: string
          sent_at?: string | null
          status: string
          subscriber_id?: string | null
        }
        Update: {
          error_message?: string | null
          event_id?: string | null
          id?: string
          notification_type?: string
          sent_at?: string | null
          status?: string
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      post_analytics: {
        Row: {
          avg_time_on_page: unknown | null
          bounce_rate: number | null
          created_at: string | null
          id: string
          post_id: string | null
          unique_views: number | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          avg_time_on_page?: unknown | null
          bounce_rate?: number | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          unique_views?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          avg_time_on_page?: unknown | null
          bounce_rate?: number | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          unique_views?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_keywords: {
        Row: {
          is_primary: boolean | null
          keyword_id: string
          post_id: string
        }
        Insert: {
          is_primary?: boolean | null
          keyword_id: string
          post_id: string
        }
        Update: {
          is_primary?: boolean | null
          keyword_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_keywords_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "seo_keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_keywords_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_versions: {
        Row: {
          changes: Json | null
          content: string
          created_at: string | null
          editor_id: string | null
          id: string
          post_id: string | null
          title: string
        }
        Insert: {
          changes?: Json | null
          content: string
          created_at?: string | null
          editor_id?: string | null
          id?: string
          post_id?: string | null
          title: string
        }
        Update: {
          changes?: Json | null
          content?: string
          created_at?: string | null
          editor_id?: string | null
          id?: string
          post_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_editor"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_versions_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_versions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          cluster_id: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          featured_video: string | null
          has_faq_schema: boolean | null
          has_infographic: boolean | null
          has_video: boolean | null
          id: string
          is_draft: boolean | null
          is_featured: boolean | null
          keyword_density: number | null
          last_edited_at: string | null
          last_edited_by: string | null
          likes_count: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          readability_score: number | null
          reading_time: number | null
          scheduled_for: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_score: number | null
          seo_title: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          cluster_id?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          featured_video?: string | null
          has_faq_schema?: boolean | null
          has_infographic?: boolean | null
          has_video?: boolean | null
          id?: string
          is_draft?: boolean | null
          is_featured?: boolean | null
          keyword_density?: number | null
          last_edited_at?: string | null
          last_edited_by?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          readability_score?: number | null
          reading_time?: number | null
          scheduled_for?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_score?: number | null
          seo_title?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          cluster_id?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          featured_video?: string | null
          has_faq_schema?: boolean | null
          has_infographic?: boolean | null
          has_video?: boolean | null
          id?: string
          is_draft?: boolean | null
          is_featured?: boolean | null
          keyword_density?: number | null
          last_edited_at?: string | null
          last_edited_by?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          readability_score?: number | null
          reading_time?: number | null
          scheduled_for?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_score?: number | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "content_clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_last_edited_by_fkey"
            columns: ["last_edited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      seo_analysis: {
        Row: {
          analyzed_at: string | null
          external_links_count: number | null
          id: string
          internal_links_count: number | null
          keyword_density: number | null
          post_id: string | null
          readability_score: number | null
          suggestions: Json | null
        }
        Insert: {
          analyzed_at?: string | null
          external_links_count?: number | null
          id?: string
          internal_links_count?: number | null
          keyword_density?: number | null
          post_id?: string | null
          readability_score?: number | null
          suggestions?: Json | null
        }
        Update: {
          analyzed_at?: string | null
          external_links_count?: number | null
          id?: string
          internal_links_count?: number | null
          keyword_density?: number | null
          post_id?: string | null
          readability_score?: number | null
          suggestions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_post"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_analysis_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string | null
          difficulty_score: number | null
          id: string
          keyword: string
          keyword_type: string
          priority: number | null
          search_volume: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty_score?: number | null
          id?: string
          keyword: string
          keyword_type: string
          priority?: number | null
          search_volume?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty_score?: number | null
          id?: string
          keyword?: string
          keyword_type?: string
          priority?: number | null
          search_volume?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          active: boolean
          agreed_to_terms: boolean
          created_at: string | null
          id: string
          phone: string
        }
        Insert: {
          active?: boolean
          agreed_to_terms?: boolean
          created_at?: string | null
          id?: string
          phone: string
        }
        Update: {
          active?: boolean
          agreed_to_terms?: boolean
          created_at?: string | null
          id?: string
          phone?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_post_views: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "editor" | "reader"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
