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
      bach_flowers: {
        Row: {
          affirmation: string | null
          color: string | null
          description: string | null
          emotion_id: string | null
          id: string
          name_english: string
          name_german: string | null
          name_latin: string | null
          number: number | null
        }
        Insert: {
          affirmation?: string | null
          color?: string | null
          description?: string | null
          emotion_id?: string | null
          id?: string
          name_english: string
          name_german?: string | null
          name_latin?: string | null
          number?: number | null
        }
        Update: {
          affirmation?: string | null
          color?: string | null
          description?: string | null
          emotion_id?: string | null
          id?: string
          name_english?: string
          name_german?: string | null
          name_latin?: string | null
          number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bach_flowers_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotion"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          therapist_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          therapist_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      emotion: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      flower_selections: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          dosage_notes: string | null
          duration_weeks: number | null
          follow_up_date: string | null
          id: string
          notes: string | null
          status: string | null
          therapist_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          dosage_notes?: string | null
          duration_weeks?: number | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          therapist_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          dosage_notes?: string | null
          duration_weeks?: number | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          therapist_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flower_selections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          id: string
          item_name: string
          item_type: string
          last_updated: string | null
          quantity: number
          therapist_id: string
          unit: string
        }
        Insert: {
          id?: string
          item_name: string
          item_type: string
          last_updated?: string | null
          quantity: number
          therapist_id: string
          unit: string
        }
        Update: {
          id?: string
          item_name?: string
          item_type?: string
          last_updated?: string | null
          quantity?: number
          therapist_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          date: string
          id: string
          invoice_number: string
          status: string
          therapist_id: string
          total_amount: number
        }
        Insert: {
          client_id: string
          date: string
          id?: string
          invoice_number: string
          status: string
          therapist_id: string
          total_amount: number
        }
        Update: {
          client_id?: string
          date?: string
          id?: string
          invoice_number?: string
          status?: string
          therapist_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      selection_flowers: {
        Row: {
          flower_id: string
          position: number
          selection_id: string
        }
        Insert: {
          flower_id: string
          position: number
          selection_id: string
        }
        Update: {
          flower_id?: string
          position?: number
          selection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "selection_flowers_flower_id_fkey"
            columns: ["flower_id"]
            isOneToOne: false
            referencedRelation: "bach_flowers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_flowers_selection_id_fkey"
            columns: ["selection_id"]
            isOneToOne: false
            referencedRelation: "flower_selections"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_selections: {
        Args: {
          p_client_id: string
        }
        Returns: {
          id: string
          date: string
          notes: string
          duration_weeks: number
          dosage_notes: string
          status: string
          flower_count: number
          is_current: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
