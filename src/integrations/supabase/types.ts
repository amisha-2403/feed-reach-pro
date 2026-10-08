export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          district: string | null
          email: string | null
          farm_name: string | null
          full_name: string | null
          gst_number: string | null
          id: string
          license_number: string | null
          phone: string | null
          shop_address: string | null
          shop_name: string | null
          state: string | null
          updated_at: string
          vehicle_type: string | null
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          email?: string | null
          farm_name?: string | null
          full_name?: string | null
          gst_number?: string | null
          id: string
          license_number?: string | null
          phone?: string | null
          shop_address?: string | null
          shop_name?: string | null
          state?: string | null
          updated_at?: string
          vehicle_type?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string | null
          farm_name?: string | null
          full_name?: string | null
          gst_number?: string | null
          id?: string
          license_number?: string | null
          phone?: string | null
          shop_address?: string | null
          shop_name?: string | null
          state?: string | null
          updated_at?: string
          vehicle_type?: string | null
          village?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          brand: string | null
          seller_id: string
          seller_type: Database["public"]["Enums"]["app_role"]
          category: string
          village: string
          district: string
          verified: boolean
          rating: number
          reviews: number
          delivery_available: boolean
          delivery_speed: Database["public"]["Enums"]["delivery_speed"]
          stock: Database["public"]["Enums"]["stock_status"]
          image: string
          gallery: string[]
          specs: { label: string; value: string }[]
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          brand?: string | null
          seller_id: string
          seller_type?: Database["public"]["Enums"]["app_role"]
          category: string
          village: string
          district: string
          verified?: boolean
          rating?: number
          reviews?: number
          delivery_available?: boolean
          delivery_speed?: Database["public"]["Enums"]["delivery_speed"]
          stock?: Database["public"]["Enums"]["stock_status"]
          image: string
          gallery?: string[]
          specs?: { label: string; value: string }[]
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          brand?: string | null
          seller_id?: string
          seller_type?: Database["public"]["Enums"]["app_role"]
          category?: string
          village?: string
          district?: string
          verified?: boolean
          rating?: number
          reviews?: number
          delivery_available?: boolean
          delivery_speed?: Database["public"]["Enums"]["delivery_speed"]
          stock?: Database["public"]["Enums"]["stock_status"]
          image?: string
          gallery?: string[]
          specs?: { label: string; value: string }[]
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          subtotal: number
          discount_amount: number
          delivery_fee: number
          gst: number
          status: Database["public"]["Enums"]["order_status"]
          payment_method: string | null
          delivery_type: "standard" | "express"
          delivery_address: string | null
          village: string | null
          district: string | null
          contact_name: string | null
          contact_phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          subtotal: number
          discount_amount?: number
          delivery_fee?: number
          gst?: number
          status?: Database["public"]["Enums"]["order_status"]
          payment_method?: string | null
          delivery_type?: "standard" | "express"
          delivery_address?: string | null
          village?: string | null
          district?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          subtotal?: number
          discount_amount?: number
          delivery_fee?: number
          gst?: number
          status?: Database["public"]["Enums"]["order_status"]
          payment_method?: string | null
          delivery_type?: "standard" | "express"
          delivery_address?: string | null
          village?: string | null
          district?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          price_at_purchase: number
          original_price_at_purchase: number
          discount_at_purchase: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity?: number
          price_at_purchase: number
          original_price_at_purchase: number
          discount_at_purchase?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price_at_purchase?: number
          original_price_at_purchase?: number
          discount_at_purchase?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "farmer" | "shopkeeper" | "delivery" | "admin",
      delivery_speed: "same-day" | "next-day" | "2-3-days",
      stock_status: "in-stock" | "low-stock" | "out-of-stock",
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "farmer", "shopkeeper", "delivery", "admin"],
    },
  },
} as const
