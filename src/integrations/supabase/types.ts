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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string
          coupon_code: string | null
          delivery_type: string
          id: string
          product_id: string
          qty: number
          saved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          added_at?: string
          coupon_code?: string | null
          delivery_type?: string
          id?: string
          product_id: string
          qty?: number
          saved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          added_at?: string
          coupon_code?: string | null
          delivery_type?: string
          id?: string
          product_id?: string
          qty?: number
          saved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          discount_at_purchase: number
          id: string
          order_id: string
          original_price_at_purchase: number
          price_at_purchase: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          discount_at_purchase?: number
          id?: string
          order_id: string
          original_price_at_purchase: number
          price_at_purchase: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          discount_at_purchase?: number
          id?: string
          order_id?: string
          original_price_at_purchase?: number
          price_at_purchase?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          delivery_address: string | null
          delivery_fee: number
          delivery_type: string
          discount_amount: number
          district: string | null
          gst: number
          id: string
          notes: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number
          delivery_type?: string
          discount_amount?: number
          district?: string | null
          gst?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total_amount: number
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number
          delivery_type?: string
          discount_amount?: number
          district?: string | null
          gst?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category: string
          created_at: string
          delivery_available: boolean
          delivery_speed: Database["public"]["Enums"]["delivery_speed"]
          description: string | null
          district: string
          gallery: string[]
          id: string
          image: string
          name: string
          original_price: number | null
          price: number
          rating: number
          reviews: number
          seller: string
          seller_id: string
          seller_type: Database["public"]["Enums"]["seller_kind"]
          specs: Json
          stock: Database["public"]["Enums"]["stock_status"]
          tags: string[]
          updated_at: string
          verified: boolean
          village: string
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string
          delivery_available?: boolean
          delivery_speed?: Database["public"]["Enums"]["delivery_speed"]
          description?: string | null
          district: string
          gallery?: string[]
          id?: string
          image: string
          name: string
          original_price?: number | null
          price: number
          rating?: number
          reviews?: number
          seller: string
          seller_id: string
          seller_type: Database["public"]["Enums"]["seller_kind"]
          specs?: Json
          stock?: Database["public"]["Enums"]["stock_status"]
          tags?: string[]
          updated_at?: string
          verified?: boolean
          village: string
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string
          delivery_available?: boolean
          delivery_speed?: Database["public"]["Enums"]["delivery_speed"]
          description?: string | null
          district?: string
          gallery?: string[]
          id?: string
          image?: string
          name?: string
          original_price?: number | null
          price?: number
          rating?: number
          reviews?: number
          seller?: string
          seller_id?: string
          seller_type?: Database["public"]["Enums"]["seller_kind"]
          specs?: Json
          stock?: Database["public"]["Enums"]["stock_status"]
          tags?: string[]
          updated_at?: string
          verified?: boolean
          village?: string
        }
        Relationships: []
      }
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
      app_role: "customer" | "farmer" | "shopkeeper" | "delivery" | "admin"
      delivery_speed: "same-day" | "next-day" | "2-3-days"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      seller_kind: "Shop" | "Farmer" | "Cooperative"
      stock_status: "in-stock" | "low-stock" | "out-of-stock"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      delivery_speed: ["same-day", "next-day", "2-3-days"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      seller_kind: ["Shop", "Farmer", "Cooperative"],
      stock_status: ["in-stock", "low-stock", "out-of-stock"],
    },
  },
} as const
