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
          service_id: string | null
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
          service_id?: string | null
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
          service_id?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tools_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_tools_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "application_services"
            referencedColumns: ["id"]
          },
        ]
      }
      application_apis: {
        Row: {
          application_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          protocol: string | null
          source_content: string | null
          source_uri: string | null
          status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          protocol?: string | null
          source_content?: string | null
          source_uri?: string | null
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          protocol?: string | null
          source_content?: string | null
          source_uri?: string | null
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_apis_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_messages: {
        Row: {
          application_id: string | null
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_service_messages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          message_type: string | null
          name: string
          schema: string | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          message_type?: string | null
          name: string
          schema?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          message_type?: string | null
          name?: string
          schema?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_service_messages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "application_services"
            referencedColumns: ["id"]
          },
        ]
      }
      application_services: {
        Row: {
          api_id: string | null
          created_at: string | null
          description: string | null
          id: string
          method: string | null
          name: string
          path: string | null
          summary: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          api_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string | null
          name: string
          path?: string | null
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          api_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string | null
          name?: string
          path?: string | null
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_services_api_id_fkey"
            columns: ["api_id"]
            isOneToOne: false
            referencedRelation: "application_apis"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          endpoints_count: number | null
          favorite: boolean | null
          id: string
          is_public: boolean | null
          name: string
          organization_id: string | null
          project_id: string | null
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
          is_public?: boolean | null
          name: string
          organization_id?: string | null
          project_id?: string | null
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
          is_public?: boolean | null
          name?: string
          organization_id?: string | null
          project_id?: string | null
          status?: string | null
          tags?: string[] | null
          tools_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_global: boolean | null
          is_public: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_global?: boolean | null
          is_public?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_global?: boolean | null
          is_public?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          features: Json
          id: string
          interval: "monthly" | "quarterly" | "yearly"
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          interval: "monthly" | "quarterly" | "yearly"
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          interval?: "monthly" | "quarterly" | "yearly"
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          job_title: string | null
          plan_id: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          plan_id?: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          plan_id?: string
          updated_at?: string | null
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
          is_public: boolean | null
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
          is_public?: boolean | null
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
          is_public?: boolean | null
          name?: string
          organization_id?: string | null
          servers_count?: number | null
          status?: string | null
          tags?: string[] | null
          tools_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_tags: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string
          resource_type: string
          tag_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          resource_id: string
          resource_type: string
          tag_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string
          resource_type?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      server_ai_tools: {
        Row: {
          ai_tool_id: string | null
          created_at: string | null
          id: string
          server_id: string | null
        }
        Insert: {
          ai_tool_id?: string | null
          created_at?: string | null
          id?: string
          server_id?: string | null
        }
        Update: {
          ai_tool_id?: string | null
          created_at?: string | null
          id?: string
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_ai_tools_ai_tool_id_fkey"
            columns: ["ai_tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_ai_tools_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_applications: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          server_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          server_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_applications_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          created_at: string | null
          description: string | null
          favorite: boolean | null
          id: string
          name: string
          organization_id: string | null
          status: string | null
          tags: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          favorite?: boolean | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          favorite?: boolean | null
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_member_by_email: {
        Args: {
          org_id: string
          member_email: string
          member_role: string
        }
        Returns: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string
          user_id: string | null
        }
      }
      add_organization_member: {
        Args: {
          org_id: string
          member_id: string
          member_role: string
        }
        Returns: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string
          user_id: string | null
        }
      }
      create_organization: {
        Args: {
          org_name: string
          org_slug: string
          org_description?: string
          org_logo_url?: string
        }
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          is_global: boolean | null
          is_public: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
      }
      has_organization_role: {
        Args: {
          org_id: string
          required_roles: string[]
        }
        Returns: boolean
      }
      is_member_of_organization: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      list_organization_members: {
        Args: {
          org_id: string
        }
        Returns: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string
          user_id: string | null
        }[]
      }
      list_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          is_global: boolean | null
          is_public: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }[]
      }
      list_user_organizations: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          name: string
          slug: string
          description: string
          logo_url: string
          is_global: boolean
          is_public: boolean
          created_at: string
          updated_at: string
          role: string
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
