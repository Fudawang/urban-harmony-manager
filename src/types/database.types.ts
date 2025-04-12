
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          member_id: string
          id_number: string
          name: string
          city: string
          district: string
          section: string
          sub_section: string
          land_number: string
          land_share: string
          land_area: string
          building_number: string
          building_share: string
          building_area: string
          created_at: string | null
        }
        Insert: {
          id?: string
          member_id: string
          id_number: string
          name: string
          city: string
          district: string
          section: string
          sub_section: string
          land_number: string
          land_share: string
          land_area: string
          building_number: string
          building_share: string
          building_area: string
          created_at?: string | null
        }
        Update: {
          id?: string
          member_id?: string
          id_number?: string
          name?: string
          city?: string
          district?: string
          section?: string
          sub_section?: string
          land_number?: string
          land_share?: string
          land_area?: string
          building_number?: string
          building_share?: string
          building_area?: string
          created_at?: string | null
        }
      }
      real_estate_properties: {
        Row: {
          id: string
          address: string
          type: string
          area: number
          owner_count: number
          district: string
          section: string
          number: string
          status: string
          last_updated: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          address: string
          type: string
          area: number
          owner_count?: number
          district: string
          section: string
          number: string
          status: string
          last_updated?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          address?: string
          type?: string
          area?: number
          owner_count?: number
          district?: string
          section?: string
          number?: string
          status?: string
          last_updated?: string | null
          created_at?: string | null
        }
      }
      real_estate_owners: {
        Row: {
          id: string
          name: string
          id_number: string
          contact_info: string
          ownership_type: string
          ownership_ratio: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          id_number: string
          contact_info: string
          ownership_type: string
          ownership_ratio?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          id_number?: string
          contact_info?: string
          ownership_type?: string
          ownership_ratio?: string | null
          notes?: string | null
          created_at?: string | null
        }
      }
      // Include other tables as needed
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
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          role: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          role?: string | null
          created_at?: string | null
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
