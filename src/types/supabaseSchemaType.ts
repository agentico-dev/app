
// This file provides type-safe access to Supabase schema tables

// Define a helper type to ensure we have proper typing for schema access
export type SchemaTable<TableName extends string> = {
  id: string;
  [key: string]: any;
};

// Define known tables in the public schema
export type Tables = {
  organizations: SchemaTable<'organizations'>;
  organization_members: SchemaTable<'organization_members'>;
  projects: SchemaTable<'projects'>;
  applications: SchemaTable<'applications'>;
  ai_tools: SchemaTable<'ai_tools'>;
  application_apis: SchemaTable<'application_apis'>;
  application_services: SchemaTable<'application_services'>;
  application_messages: SchemaTable<'application_messages'>;
  server_applications: SchemaTable<'server_applications'>;
  server_ai_tools: SchemaTable<'server_ai_tools'>;
  users: SchemaTable<'users'>;
  profiles: SchemaTable<'profiles'>;
  tags: SchemaTable<'tags'>;
  resource_tags: SchemaTable<'resource_tags'>;
  servers: SchemaTable<'servers'>;
  plans: SchemaTable<'plans'>;
  dashboard_metrics: {
    projects_count: number;
    applications_count: number;
    servers_count: number;
    ai_tools_count: number;
  };
};
