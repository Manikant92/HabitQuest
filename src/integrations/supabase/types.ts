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
      food_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      food_order_items: {
        Row: {
          created_at: string | null
          food_item_id: string
          id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string | null
          food_item_id: string
          id?: string
          order_id: string
          price: number
          quantity?: number
        }
        Update: {
          created_at?: string | null
          food_item_id?: string
          id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "food_order_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "food_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      food_orders: {
        Row: {
          created_at: string | null
          id: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          completed: boolean
          created_at: string | null
          game_id: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          game_id: string
          id?: string
          score?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          game_id?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          points: number
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points?: number
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points?: number
          type?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      points_history: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          level: number | null
          streak_days: number | null
          total_points: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          level?: number | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          category: Database["public"]["Enums"]["reward_category"]
          created_at: string | null
          description: string | null
          id: string
          points_cost: number
          title: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["reward_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          points_cost: number
          title: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["reward_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          points_cost?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      social_tracking: {
        Row: {
          created_at: string | null
          duration: number
          id: string
          platform: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration: number
          id?: string
          platform: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number
          id?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: Database["public"]["Enums"]["task_category"]
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          points: number
          title: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          points?: number
          title: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          points?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      reward_category:
        | "entertainment"
        | "social"
        | "food"
        | "shopping"
        | "other"
      task_category: "morning" | "work" | "health" | "personal" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      reward_category: ["entertainment", "social", "food", "shopping", "other"],
      task_category: ["morning", "work", "health", "personal", "other"],
    },
  },
} as const
