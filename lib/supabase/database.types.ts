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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          admin_notes_updated_at: string | null
          admin_notes_updated_by: string | null
          created_at: string
          email: string
          estimated_guest_count: number
          event_date: string
          event_location: string
          event_time: string
          event_type: string
          event_type_other: string | null
          first_name: string
          id: string
          last_name: string
          package_id: string
          package_name_snapshot: string
          package_price_display_snapshot: string
          package_price_snapshot: number
          package_pricing_mode_snapshot: string
          phone_number: string
          phone_search_digits: string
          reference: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          admin_notes_updated_at?: string | null
          admin_notes_updated_by?: string | null
          created_at?: string
          email: string
          estimated_guest_count: number
          event_date: string
          event_location: string
          event_time: string
          event_type: string
          event_type_other?: string | null
          first_name: string
          id?: string
          last_name: string
          package_id: string
          package_name_snapshot: string
          package_price_display_snapshot: string
          package_price_snapshot: number
          package_pricing_mode_snapshot: string
          phone_number: string
          phone_search_digits: string
          reference: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          admin_notes_updated_at?: string | null
          admin_notes_updated_by?: string | null
          created_at?: string
          email?: string
          estimated_guest_count?: number
          event_date?: string
          event_location?: string
          event_time?: string
          event_type?: string
          event_type_other?: string | null
          first_name?: string
          id?: string
          last_name?: string
          package_id?: string
          package_name_snapshot?: string
          package_price_display_snapshot?: string
          package_price_snapshot?: number
          package_pricing_mode_snapshot?: string
          phone_number?: string
          phone_search_digits?: string
          reference?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiry_custom_mocktails: {
        Row: {
          base: string
          created_at: string
          drink_choice_id: string
          garnishes: string[]
          id: string
          puree: string
          syrup: string
        }
        Insert: {
          base: string
          created_at?: string
          drink_choice_id: string
          garnishes?: string[]
          id?: string
          puree: string
          syrup: string
        }
        Update: {
          base?: string
          created_at?: string
          drink_choice_id?: string
          garnishes?: string[]
          id?: string
          puree?: string
          syrup?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_custom_mocktails_drink_choice_id_fkey"
            columns: ["drink_choice_id"]
            isOneToOne: true
            referencedRelation: "inquiry_drink_choices"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_drink_choices: {
        Row: {
          choice_type: string
          created_at: string
          id: string
          inquiry_id: string
          position: number
          signature_drink_id: string | null
          signature_drink_name_snapshot: string | null
        }
        Insert: {
          choice_type: string
          created_at?: string
          id?: string
          inquiry_id: string
          position: number
          signature_drink_id?: string | null
          signature_drink_name_snapshot?: string | null
        }
        Update: {
          choice_type?: string
          created_at?: string
          id?: string
          inquiry_id?: string
          position?: number
          signature_drink_id?: string | null
          signature_drink_name_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_drink_choices_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_inquiry: {
        Args: {
          p_additional_notes: string
          p_drinks: Json
          p_email: string
          p_estimated_guest_count: number
          p_event_date: string
          p_event_location: string
          p_event_time: string
          p_event_type: string
          p_event_type_other: string
          p_first_name: string
          p_last_name: string
          p_package_id: string
          p_phone_number: string
          p_phone_search_digits: string
          p_source?: string
        }
        Returns: Json
      }
      generate_inquiry_reference: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      search_inquiries: {
        Args: {
          p_direction?: string
          p_event_date?: string
          p_event_type?: string
          p_package_id?: string
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_sort?: string
          p_status?: string
        }
        Returns: {
          additional_notes: string
          admin_notes: string
          created_at: string
          email: string
          estimated_guest_count: number
          event_date: string
          event_location: string
          event_time: string
          event_type: string
          event_type_other: string
          first_name: string
          id: string
          last_name: string
          package_id: string
          package_name_snapshot: string
          package_price_display_snapshot: string
          package_price_snapshot: number
          package_pricing_mode_snapshot: string
          phone_number: string
          phone_search_digits: string
          reference: string
          source: string
          status: string
          total_count: number
          updated_at: string
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
    Enums: {},
  },
} as const
