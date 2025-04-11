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
      board_members: {
        Row: {
          contact: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean
          member_id: string
          name: string
          position: string
          start_date: string
          term: number
          title: string
        }
        Insert: {
          contact: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          member_id: string
          name: string
          position: string
          start_date: string
          term: number
          title: string
        }
        Update: {
          contact?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          member_id?: string
          name?: string
          position?: string
          start_date?: string
          term?: number
          title?: string
        }
        Relationships: []
      }
      installation_steps: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          sort_order: number
          status: string
          step_name: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          sort_order: number
          status?: string
          step_name: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          sort_order?: number
          status?: string
          step_name?: string
        }
        Relationships: []
      }
      meeting_attendance: {
        Row: {
          building_share: string
          check_in_time: string
          created_at: string | null
          id: string
          land_share: string
          meeting_id: string
          member_id: string
          member_name: string
        }
        Insert: {
          building_share: string
          check_in_time?: string
          created_at?: string | null
          id?: string
          land_share: string
          meeting_id: string
          member_id: string
          member_name: string
        }
        Update: {
          building_share?: string
          check_in_time?: string
          created_at?: string | null
          id?: string
          land_share?: string
          meeting_id?: string
          member_id?: string
          member_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendance_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_documents: {
        Row: {
          created_at: string | null
          file_url: string
          id: string
          meeting_id: string
          size: number
          title: string
          type: string
          upload_date: string
        }
        Insert: {
          created_at?: string | null
          file_url: string
          id?: string
          meeting_id: string
          size: number
          title: string
          type: string
          upload_date: string
        }
        Update: {
          created_at?: string | null
          file_url?: string
          id?: string
          meeting_id?: string
          size?: number
          title?: string
          type?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_documents_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          attendance_stats: Json | null
          attendees: number
          check_in_enabled: boolean | null
          created_at: string | null
          date: string
          documents: number
          id: string
          location: string
          number: number
          status: string
          term: number
          title: string
          total_members: number
          type: string
        }
        Insert: {
          attendance_stats?: Json | null
          attendees?: number
          check_in_enabled?: boolean | null
          created_at?: string | null
          date: string
          documents?: number
          id?: string
          location: string
          number: number
          status: string
          term: number
          title: string
          total_members: number
          type: string
        }
        Update: {
          attendance_stats?: Json | null
          attendees?: number
          check_in_enabled?: boolean | null
          created_at?: string | null
          date?: string
          documents?: number
          id?: string
          location?: string
          number?: number
          status?: string
          term?: number
          title?: string
          total_members?: number
          type?: string
        }
        Relationships: []
      }
      member_property_ownerships: {
        Row: {
          created_at: string | null
          id: string
          member_id: string
          notes: string | null
          ownership_ratio: string
          ownership_type: string
          property_id: string
          property_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id: string
          notes?: string | null
          ownership_ratio: string
          ownership_type: string
          property_id: string
          property_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          ownership_ratio?: string
          ownership_type?: string
          property_id?: string
          property_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_property_ownerships_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "real_estate_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          building_area: string
          building_number: string
          building_share: string
          city: string
          created_at: string | null
          district: string
          id: string
          id_number: string
          land_area: string
          land_number: string
          land_share: string
          member_id: string
          name: string
          section: string
          sub_section: string
        }
        Insert: {
          building_area: string
          building_number: string
          building_share: string
          city: string
          created_at?: string | null
          district: string
          id?: string
          id_number: string
          land_area: string
          land_number: string
          land_share: string
          member_id: string
          name: string
          section: string
          sub_section: string
        }
        Update: {
          building_area?: string
          building_number?: string
          building_share?: string
          city?: string
          created_at?: string | null
          district?: string
          id?: string
          id_number?: string
          land_area?: string
          land_number?: string
          land_share?: string
          member_id?: string
          name?: string
          section?: string
          sub_section?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string | null
          description: string
          id: string
          meeting_id: string
          meeting_title: string
          number: string
          status: string
          title: string
          type: string
          votes: Json
          voting_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          meeting_id: string
          meeting_title: string
          number: string
          status: string
          title: string
          type: string
          votes: Json
          voting_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          meeting_id?: string
          meeting_title?: string
          number?: string
          status?: string
          title?: string
          type?: string
          votes?: Json
          voting_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      real_estate_owners: {
        Row: {
          contact_info: string
          created_at: string | null
          id: string
          id_number: string
          name: string
          notes: string | null
          ownership_ratio: string | null
          ownership_type: string
        }
        Insert: {
          contact_info: string
          created_at?: string | null
          id?: string
          id_number: string
          name: string
          notes?: string | null
          ownership_ratio?: string | null
          ownership_type: string
        }
        Update: {
          contact_info?: string
          created_at?: string | null
          id?: string
          id_number?: string
          name?: string
          notes?: string | null
          ownership_ratio?: string | null
          ownership_type?: string
        }
        Relationships: []
      }
      real_estate_properties: {
        Row: {
          address: string
          area: number
          created_at: string | null
          district: string
          id: string
          last_updated: string | null
          number: string
          owner_count: number
          section: string
          status: string
          type: string
        }
        Insert: {
          address: string
          area: number
          created_at?: string | null
          district: string
          id?: string
          last_updated?: string | null
          number: string
          owner_count?: number
          section: string
          status: string
          type: string
        }
        Update: {
          address?: string
          area?: number
          created_at?: string | null
          district?: string
          id?: string
          last_updated?: string | null
          number?: string
          owner_count?: number
          section?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      votes: {
        Row: {
          building_share: string
          created_at: string | null
          decision: string
          id: string
          land_share: string
          member_id: string
          member_name: string
          proposal_id: string
          timestamp: string
        }
        Insert: {
          building_share: string
          created_at?: string | null
          decision: string
          id?: string
          land_share: string
          member_id: string
          member_name: string
          proposal_id: string
          timestamp?: string
        }
        Update: {
          building_share?: string
          created_at?: string | null
          decision?: string
          id?: string
          land_share?: string
          member_id?: string
          member_name?: string
          proposal_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
