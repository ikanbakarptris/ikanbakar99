export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      reviews: {
        Row: {
          bike_type: string | null;
          created_at: string;
          id: string;
          is_local_guide: boolean;
          media_url: string | null;
          owner_reply: string | null;
          rating: number;
          review_text: string;
          reviewer_avatar_url: string | null;
          reviewer_name: string;
          reviewer_role: string | null;
          reviewer_url: string | null;
          sort_order: number;
        };
        Insert: {
          bike_type?: string | null;
          created_at?: string;
          id?: string;
          is_local_guide?: boolean;
          media_url?: string | null;
          owner_reply?: string | null;
          rating?: number;
          review_text: string;
          reviewer_avatar_url?: string | null;
          reviewer_name: string;
          reviewer_role?: string | null;
          reviewer_url?: string | null;
          sort_order?: number;
        };
        Update: {
          bike_type?: string | null;
          created_at?: string;
          id?: string;
          is_local_guide?: boolean;
          media_url?: string | null;
          owner_reply?: string | null;
          rating?: number;
          review_text?: string;
          reviewer_avatar_url?: string | null;
          reviewer_name?: string;
          reviewer_role?: string | null;
          reviewer_url?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          active_template: string | null;
          address_title: string;
          advanced_css: string | null;
          advanced_head_scripts: string | null;
          advanced_json_ld: string | null;
          carousel_images: string[];
          contact_email: string | null;
          cta_maps_text: string;
          cta_whatsapp_text: string;
          font_family: string;
          header_subtitle: string;
          hero_badge: string;
          hero_desc_1: string;
          hero_desc_2: string;
          hero_image: string | null;
          hero_stats: Json;
          hero_title: string;
          id: string;
          maps_url: string;
          services: Json;
          services_subtitle: string;
          services_title: string;
          shop_address: string;
          shop_hours: string;
          shop_name: string;
          shop_rating: number;
          shop_reviews_count: number;
          social_facebook: string | null;
          social_instagram: string | null;
          social_tiktok: string | null;
          theme_color: string;
          trust_pickup_desc: string;
          trust_pickup_title: string;
          trust_rating_text: string;
          updated_at: string;
          whatsapp_number: string;
        };
        Insert: {
          active_template?: string | null;
          address_title?: string;
          advanced_css?: string | null;
          advanced_head_scripts?: string | null;
          advanced_json_ld?: string | null;
          carousel_images?: string[];
          contact_email?: string | null;
          cta_maps_text?: string;
          cta_whatsapp_text?: string;
          font_family?: string;
          header_subtitle?: string;
          hero_badge?: string;
          hero_desc_1?: string;
          hero_desc_2?: string;
          hero_image?: string | null;
          hero_stats?: Json;
          hero_title?: string;
          id?: string;
          maps_url?: string;
          services?: Json;
          services_subtitle?: string;
          services_title?: string;
          shop_address?: string;
          shop_hours?: string;
          shop_name?: string;
          shop_rating?: number;
          shop_reviews_count?: number;
          social_facebook?: string | null;
          social_instagram?: string | null;
          social_tiktok?: string | null;
          theme_color?: string;
          trust_pickup_desc?: string;
          trust_pickup_title?: string;
          trust_rating_text?: string;
          updated_at?: string;
          whatsapp_number?: string;
        };
        Update: {
          active_template?: string | null;
          address_title?: string;
          advanced_css?: string | null;
          advanced_head_scripts?: string | null;
          advanced_json_ld?: string | null;
          carousel_images?: string[];
          contact_email?: string | null;
          cta_maps_text?: string;
          cta_whatsapp_text?: string;
          font_family?: string;
          header_subtitle?: string;
          hero_badge?: string;
          hero_desc_1?: string;
          hero_desc_2?: string;
          hero_image?: string | null;
          hero_stats?: Json;
          hero_title?: string;
          id?: string;
          maps_url?: string;
          services?: Json;
          services_subtitle?: string;
          services_title?: string;
          shop_address?: string;
          shop_hours?: string;
          shop_name?: string;
          shop_rating?: number;
          shop_reviews_count?: number;
          social_facebook?: string | null;
          social_instagram?: string | null;
          social_tiktok?: string | null;
          theme_color?: string;
          trust_pickup_desc?: string;
          trust_pickup_title?: string;
          trust_rating_text?: string;
          updated_at?: string;
          whatsapp_number?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
