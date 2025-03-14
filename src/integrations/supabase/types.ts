export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  api: {
    Tables: {
      ai_tools: {
        Row: {
          agents_count: number | null
          applications_count: number | null
          category: string | null
          created_at: string | null
          description: string | null
          favorite: boolean | null
          id: string
          name: string
          organization_id: string | null
          servers_count: number | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agents_count?: number | null
          applications_count?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          favorite?: boolean | null
          id?: string
          name: string
          organization_id?: string | null
          servers_count?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agents_count?: number | null
          applications_count?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          favorite?: boolean | null
          id?: string
          name?: string
          organization_id?: string | null
          servers_count?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          endpoints_count: number | null
          favorite: boolean | null
          id: string
          name: string
          organization_id: string | null
          status: string | null
          tags: string[] | null
          tools_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          endpoints_count?: number | null
          favorite?: boolean | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
          tags?: string[] | null
          tools_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          endpoints_count?: number | null
          favorite?: boolean | null
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
          tags?: string[] | null
          tools_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          applications_count: number | null
          created_at: string | null
          description: string | null
          favorite: boolean | null
          id: string
          name: string
          organization_id: string | null
          servers_count: number | null
          status: string | null
          tags: string[] | null
          tools_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applications_count?: number | null
          created_at?: string | null
          description?: string | null
          favorite?: boolean | null
          id?: string
          name: string
          organization_id?: string | null
          servers_count?: number | null
          status?: string | null
          tags?: string[] | null
          tools_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applications_count?: number | null
          created_at?: string | null
          description?: string | null
          favorite?: boolean | null
          id?: string
          name?: string
          organization_id?: string | null
          servers_count?: number | null
          status?: string | null
          tags?: string[] | null
          tools_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          organization_id: string;
          user_id: string;
        };
        Insert: {
          organization_id: string;
          user_id: string;
        };
        Update: {
          organization_id?: string;
          user_id?: string;
        }
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

type PublicSchema = Database[Extract<keyof Database, "api" | "public">]

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
