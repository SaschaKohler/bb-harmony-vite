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
          created_at: string | null
          description: string | null
          emotion_id: string | null
          id: string
          name_english: string
          name_german: string | null
          name_latin: string | null
          number: number | null
          updated_at: string | null
        }
        Insert: {
          affirmation?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          emotion_id?: string | null
          id?: string
          name_english: string
          name_german?: string | null
          name_latin?: string | null
          number?: number | null
          updated_at?: string | null
        }
        Update: {
          affirmation?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          emotion_id?: string | null
          id?: string
          name_english?: string
          name_german?: string | null
          name_latin?: string | null
          number?: number | null
          updated_at?: string | null
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
          address_old: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          house_number: string | null
          id: string
          last_name: string
          phone: string | null
          postal_code: string | null
          street: string | null
          therapist_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          address_old?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          house_number?: string | null
          id?: string
          last_name: string
          phone?: string | null
          postal_code?: string | null
          street?: string | null
          therapist_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          address_old?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          house_number?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          street?: string | null
          therapist_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "user_learning_progress"
            referencedColumns: ["user_id"]
          },
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
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
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
            referencedRelation: "client_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flower_selections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      flower_symptom_relations: {
        Row: {
          created_at: string | null
          flower_id: string | null
          id: string
          is_primary: boolean | null
          symptom_id: string | null
        }
        Insert: {
          created_at?: string | null
          flower_id?: string | null
          id?: string
          is_primary?: boolean | null
          symptom_id?: string | null
        }
        Update: {
          created_at?: string | null
          flower_id?: string | null
          id?: string
          is_primary?: boolean | null
          symptom_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flower_symptom_relations_flower_id_fkey"
            columns: ["flower_id"]
            isOneToOne: false
            referencedRelation: "bach_flowers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flower_symptom_relations_symptom_id_fkey"
            columns: ["symptom_id"]
            isOneToOne: false
            referencedRelation: "symptoms"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          item_type: string
          last_updated: string | null
          quantity: number
          therapist_id: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          item_type: string
          last_updated?: string | null
          quantity: number
          therapist_id: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          item_type?: string
          last_updated?: string | null
          quantity?: number
          therapist_id?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "user_learning_progress"
            referencedColumns: ["user_id"]
          },
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
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string | null
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
          created_at: string | null
          date: string
          id: string
          invoice_number: string
          status: string
          therapist_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          id?: string
          invoice_number: string
          status: string
          therapist_id: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          id?: string
          invoice_number?: string
          status?: string
          therapist_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_addresses"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "user_learning_progress"
            referencedColumns: ["user_id"]
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
      learning_lessons: {
        Row: {
          content_key: string
          created_at: string | null
          description: string | null
          estimated_duration: number | null
          id: string
          is_active: boolean | null
          module_id: string | null
          order_index: number
          prerequisites: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_key: string
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          module_id?: string | null
          order_index: number
          prerequisites?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_key?: string
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          module_id?: string | null
          order_index?: number
          prerequisites?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string
          id: string
          is_active: boolean | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_prerequisites: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          required_lesson_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          required_lesson_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          required_lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_prerequisites_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_prerequisites_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_prerequisites_required_lesson_id_fkey"
            columns: ["required_lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_prerequisites_required_lesson_id_fkey"
            columns: ["required_lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_details"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_resources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_required: boolean | null
          lesson_id: string | null
          order_index: number | null
          title: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          order_index?: number | null
          title: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          order_index?: number | null
          title?: string
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_details"
            referencedColumns: ["id"]
          },
        ]
      }
      secondary_symptoms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          primary_symptom_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          primary_symptom_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          primary_symptom_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "secondary_symptoms_primary_symptom_id_fkey"
            columns: ["primary_symptom_id"]
            isOneToOne: false
            referencedRelation: "symptoms"
            referencedColumns: ["id"]
          },
        ]
      }
      selection_flowers: {
        Row: {
          created_at: string | null
          flower_id: string
          position: number
          selection_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flower_id: string
          position: number
          selection_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flower_id?: string
          position?: number
          selection_id?: string
          updated_at?: string | null
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
      symptom_groups: {
        Row: {
          created_at: string | null
          description: string | null
          emotion_category: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emotion_category: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emotion_category?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          created_at: string | null
          description: string | null
          group_id: string | null
          id: string
          indication_type: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          indication_type?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          indication_type?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptoms_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "symptom_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lesson_id: string | null
          page_number: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          page_number: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          page_number?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_learning_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_lesson_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed_pages: number[] | null
          completion_date: string | null
          created_at: string | null
          current_page: number | null
          id: string
          last_accessed: string | null
          lesson_id: string | null
          quiz_results: Json | null
          score: number | null
          start_date: string | null
          status: string | null
          total_pages: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_pages?: number[] | null
          completion_date?: string | null
          created_at?: string | null
          current_page?: number | null
          id?: string
          last_accessed?: string | null
          lesson_id?: string | null
          quiz_results?: Json | null
          score?: number | null
          start_date?: string | null
          status?: string | null
          total_pages?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_pages?: number[] | null
          completion_date?: string | null
          created_at?: string | null
          current_page?: number | null
          id?: string
          last_accessed?: string | null
          lesson_id?: string | null
          quiz_results?: Json | null
          score?: number | null
          start_date?: string | null
          status?: string | null
          total_pages?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_learning_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_addresses: {
        Row: {
          city: string | null
          country: string | null
          first_name: string | null
          full_address: string | null
          house_number: string | null
          id: string | null
          last_name: string | null
          postal_code: string | null
          street: string | null
          therapist_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          first_name?: string | null
          full_address?: never
          house_number?: string | null
          id?: string | null
          last_name?: string | null
          postal_code?: string | null
          street?: string | null
          therapist_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          first_name?: string | null
          full_address?: never
          house_number?: string | null
          id?: string | null
          last_name?: string | null
          postal_code?: string | null
          street?: string | null
          therapist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "user_learning_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "clients_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_details: {
        Row: {
          content_key: string | null
          description: string | null
          estimated_duration: number | null
          id: string | null
          module_icon: string | null
          module_id: string | null
          module_title: string | null
          order_index: number | null
          prerequisites: string[] | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_progress: {
        Row: {
          completion_date: string | null
          current_page: number | null
          email: string | null
          last_accessed: string | null
          lesson_title: string | null
          module_title: string | null
          score: number | null
          start_date: string | null
          status: string | null
          total_pages: number | null
          user_id: string | null
        }
        Relationships: []
      }
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
      get_symptom_id: {
        Args: {
          symptom_name: string
        }
        Returns: string
      }
      migrate_addresses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
