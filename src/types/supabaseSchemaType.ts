
// // This file provides type-safe access to Supabase schema tables

// // Define a helper type to ensure we have proper typing for schema access
// export type ApiSchemaTable<TableName extends string> = {
//   id: string;
//   [key: string]: any;
// };

// // Define known tables in the API schema
// export type ApiTables = {
//   organizations: ApiSchemaTable<'organizations'>;
//   organization_members: ApiSchemaTable<'organization_members'>;
//   projects: ApiSchemaTable<'projects'>;
//   applications: ApiSchemaTable<'applications'>;
//   ai_tools: ApiSchemaTable<'ai_tools'>;
//   application_apis: ApiSchemaTable<'application_apis'>;
//   application_services: ApiSchemaTable<'application_services'>;
//   application_messages: ApiSchemaTable<'application_messages'>;
//   server_applications: ApiSchemaTable<'server_applications'>;
//   server_ai_tools: ApiSchemaTable<'server_ai_tools'>;
//   users: ApiSchemaTable<'users'>;
//   profiles: ApiSchemaTable<'profiles'>;
//   tags: ApiSchemaTable<'tags'>;
//   resource_tags: ApiSchemaTable<'resource_tags'>;
//   servers: ApiSchemaTable<'servers'>;
//   plans: ApiSchemaTable<'plans'>;
// };
