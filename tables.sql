-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS api;

-- Create tables for profiles if it doesn't exist yet
CREATE TABLE IF NOT EXISTS api.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  bio TEXT,
  job_title TEXT,
  company TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS api.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  is_global BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organization_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS api.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES api.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS api.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES api.organizations(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT FALSE,
  applications_count INTEGER DEFAULT 0,
  servers_count INTEGER DEFAULT 0,
  tools_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS api.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES api.organizations(id) ON DELETE SET NULL,
  project_id UUID REFERENCES api.projects(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT FALSE,
  endpoints_count INTEGER DEFAULT 0,
  tools_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create servers table if it doesn't exist
CREATE TABLE IF NOT EXISTS api.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  status TEXT DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES api.organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ai_tools table
CREATE TABLE IF NOT EXISTS api.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  favorite BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES api.organizations(id) ON DELETE SET NULL,
  agents_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  servers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create application_apis table
CREATE TABLE IF NOT EXISTS api.application_apis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES api.applications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  source_uri TEXT,
  source_content TEXT,
  status TEXT DEFAULT 'active',
  version TEXT,
  protocol TEXT CHECK (protocol IN ('REST', 'gRPC', 'WebSockets', 'GraphQL')),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create application_services table
CREATE TABLE IF NOT EXISTS api.application_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_id UUID REFERENCES api.application_apis(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  path TEXT,
  method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create application_service_messages table
CREATE TABLE IF NOT EXISTS api.application_service_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES api.application_services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  message_type TEXT CHECK (message_type IN ('request', 'response')),
  schema TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add relationship between AI tools and application services
ALTER TABLE api.ai_tools 
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES api.application_services(id) ON DELETE SET NULL;

-- Create a global organization if it doesn't exist
INSERT INTO api.organizations (name, slug, description, is_global, is_public)
SELECT 'Global', 'global', 'Public organization available to all users', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM api.organizations WHERE is_global = TRUE);

-- Create trigger function to create user organization
CREATE OR REPLACE FUNCTION api.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Create profile
  INSERT INTO api.profiles (id, full_name, plan_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'plan_id', 'free'));
  
  -- Create user's personal organization
  INSERT INTO api.organizations (name, slug, description)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User ' || NEW.id), 
    'user-' || lower(replace(NEW.id::text, '-', '')),
    'Personal organization for ' || COALESCE(NEW.raw_user_meta_data->>'full_name', 'User ' || NEW.id)
  )
  RETURNING id INTO org_id;
  
  -- Add user as owner of their organization
  INSERT INTO api.organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION api.handle_new_user();

-- Create RPC functions for organization operations
CREATE OR REPLACE FUNCTION api.list_organizations()
RETURNS SETOF api.organizations AS $$
  SELECT * FROM api.organizations WHERE is_public = TRUE OR is_global = TRUE
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION api.list_user_organizations(user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  logo_url TEXT,
  is_global BOOLEAN,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  role TEXT
) AS $$
  SELECT o.*, m.role
  FROM api.organizations o
  LEFT JOIN api.organization_members m ON o.id = m.organization_id AND m.user_id = list_user_organizations.user_id
  WHERE o.is_global = TRUE OR m.user_id = list_user_organizations.user_id
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION api.create_organization(
  org_name TEXT,
  org_slug TEXT,
  org_description TEXT DEFAULT NULL,
  org_logo_url TEXT DEFAULT NULL
)
RETURNS api.organizations AS $$
DECLARE
  new_org api.organizations;
BEGIN
  INSERT INTO api.organizations (name, slug, description, logo_url)
  VALUES (org_name, org_slug, org_description, org_logo_url)
  RETURNING * INTO new_org;
  
  RETURN new_org;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION api.add_organization_member(
  org_id UUID,
  member_id UUID,
  member_role TEXT
)
RETURNS api.organization_members AS $$
DECLARE
  new_member api.organization_members;
BEGIN
  INSERT INTO api.organization_members (organization_id, user_id, role)
  VALUES (org_id, member_id, member_role)
  RETURNING * INTO new_member;
  
  RETURN new_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION api.add_member_by_email(
  org_id UUID,
  member_email TEXT,
  member_role TEXT
)
RETURNS api.organization_members AS $$
DECLARE
  user_id UUID;
  new_member api.organization_members;
BEGIN
  -- Find user by email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = member_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', member_email;
  END IF;
  
  -- Add member to organization
  INSERT INTO api.organization_members (organization_id, user_id, role)
  VALUES (org_id, user_id, member_role)
  RETURNING * INTO new_member;
  
  RETURN new_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION api.list_organization_members(org_id UUID)
RETURNS SETOF api.organization_members AS $$
  SELECT * FROM api.organization_members WHERE organization_id = org_id
$$ LANGUAGE SQL SECURITY DEFINER;

-- Add RLS policies
ALTER TABLE api.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.application_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.application_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.application_service_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.profiles ENABLE ROW LEVEL SECURITY;

-- Default access policies for profiles
CREATE POLICY "Users can view their own profile" ON api.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON api.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations access policies
CREATE POLICY "Anyone can view public or global organizations" ON api.organizations
  FOR SELECT USING (is_public = TRUE OR is_global = TRUE);

CREATE POLICY "Organization members can view their organizations" ON api.organizations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM api.organization_members WHERE organization_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Organization owners can update their organizations" ON api.organizations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM api.organization_members WHERE organization_id = id AND user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Organization owners can delete their organizations" ON api.organizations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM api.organization_members WHERE organization_id = id AND user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Authenticated users can create organizations" ON api.organizations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Organization members access policies
CREATE POLICY "Organization members can view other members" ON api.organization_members
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Organization admins and owners can create members" ON api.organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.organization_members 
      WHERE organization_id = organization_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Organization owners can delete members" ON api.organization_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api.organization_members 
      WHERE organization_id = organization_id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Applications access policies
CREATE POLICY "Anyone can view public applications" ON api.applications
  FOR SELECT USING (
    is_public = TRUE OR 
    organization_id IN (
      SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE
    )
  );

CREATE POLICY "Organization members can view their applications" ON api.applications
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create applications" ON api.applications
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their applications" ON api.applications
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their applications" ON api.applications
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

-- Application APIs access policies
CREATE POLICY "Anyone can view public APIs" ON api.application_apis
  FOR SELECT USING (
    is_public = TRUE OR
    EXISTS (
      SELECT 1 FROM api.applications a
      WHERE a.id = application_id AND (
        a.is_public = TRUE OR
        a.organization_id IN (SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE)
      )
    )
  );

CREATE POLICY "Organization members can view their APIs" ON api.application_apis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api.applications a
      JOIN api.organizations o ON a.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = application_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create APIs" ON api.application_apis
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.applications a
      JOIN api.organizations o ON a.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = application_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their APIs" ON api.application_apis
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM api.applications a
      JOIN api.organizations o ON a.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = application_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their APIs" ON api.application_apis
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api.applications a
      JOIN api.organizations o ON a.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = application_id AND m.user_id = auth.uid()
    )
  );

-- Similar policies for application_services
CREATE POLICY "Anyone can view services of public APIs" ON api.application_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api.application_apis a
      WHERE a.id = api_id AND (
        a.is_public = TRUE OR
        EXISTS (
          SELECT 1 FROM api.applications app
          WHERE app.id = a.application_id AND (
            app.is_public = TRUE OR
            app.organization_id IN (SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE)
          )
        )
      )
    )
  );

CREATE POLICY "Organization members can view their services" ON api.application_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api.application_apis a
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = api_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create services" ON api.application_services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.application_apis a
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = api_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their services" ON api.application_services
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM api.application_apis a
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = api_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their services" ON api.application_services
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api.application_apis a
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE a.id = api_id AND m.user_id = auth.uid()
    )
  );

-- Similar policies for application_service_messages
CREATE POLICY "Anyone can view messages of public services" ON api.application_service_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api.application_services s
      JOIN api.application_apis a ON s.api_id = a.id
      WHERE s.id = service_id AND (
        a.is_public = TRUE OR
        EXISTS (
          SELECT 1 FROM api.applications app
          WHERE app.id = a.application_id AND (
            app.is_public = TRUE OR
            app.organization_id IN (SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE)
          )
        )
      )
    )
  );

CREATE POLICY "Organization members can view their messages" ON api.application_service_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api.application_services s
      JOIN api.application_apis a ON s.api_id = a.id
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE s.id = service_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create messages" ON api.application_service_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.application_services s
      JOIN api.application_apis a ON s.api_id = a.id
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE s.id = service_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their messages" ON api.application_service_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM api.application_services s
      JOIN api.application_apis a ON s.api_id = a.id
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE s.id = service_id AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their messages" ON api.application_service_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api.application_services s
      JOIN api.application_apis a ON s.api_id = a.id
      JOIN api.applications app ON a.application_id = app.id
      JOIN api.organizations o ON app.organization_id = o.id
      JOIN api.organization_members m ON o.id = m.organization_id
      WHERE s.id = service_id AND m.user_id = auth.uid()
    )
  );

-- Projects access policies
CREATE POLICY "Anyone can view public projects" ON api.projects
  FOR SELECT USING (
    is_public = TRUE OR
    organization_id IN (
      SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE
    )
  );

CREATE POLICY "Organization members can view their projects" ON api.projects
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create projects" ON api.projects
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their projects" ON api.projects
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their projects" ON api.projects
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

-- Servers access policies
CREATE POLICY "Anyone can view servers from public orgs" ON api.servers
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE
    )
  );

CREATE POLICY "Organization members can view their servers" ON api.servers
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create servers" ON api.servers
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their servers" ON api.servers
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their servers" ON api.servers
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

-- AI Tools access policies
CREATE POLICY "Anyone can view AI tools from public orgs" ON api.ai_tools
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM api.organizations WHERE is_global = TRUE OR is_public = TRUE
    )
  );

CREATE POLICY "Organization members can view their AI tools" ON api.ai_tools
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create AI tools" ON api.ai_tools
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can update their AI tools" ON api.ai_tools
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can delete their AI tools" ON api.ai_tools
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM api.organization_members WHERE user_id = auth.uid()
    )
  );

----
-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION api.handle_user_deletion()
RETURNS TRIGGER AS $$
DECLARE
  owned_orgs UUID[];
BEGIN
  -- Find organizations where this user is the only owner
  SELECT ARRAY_AGG(organization_id) INTO owned_orgs
  FROM (
    SELECT om.organization_id
    FROM api.organization_members om
    WHERE om.role = 'owner'
    GROUP BY om.organization_id
    HAVING COUNT(CASE WHEN om.role = 'owner' THEN 1 ELSE NULL END) = 1
    AND bool_or(om.user_id = OLD.id AND om.role = 'owner')
  ) AS sole_owner_orgs;
  
  -- Delete organizations where this user is the only owner
  IF array_length(owned_orgs, 1) > 0 THEN
    DELETE FROM api.organizations
    WHERE id = ANY(owned_orgs);
  END IF;
  
  -- Remove user from all other organizations
  DELETE FROM api.organization_members
  WHERE user_id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION api.handle_user_deletion();

-- Create function to handle organization deletion (only owners can delete via RLS)
CREATE OR REPLACE FUNCTION api.handle_organization_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove all members from the organization
  DELETE FROM api.organization_members
  WHERE organization_id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for organization deletion
DROP TRIGGER IF EXISTS on_organization_deleted ON api.organizations;
CREATE TRIGGER on_organization_deleted
  BEFORE DELETE ON api.organizations
  FOR EACH ROW EXECUTE FUNCTION api.handle_organization_deletion();

-- Add RLS policy to allow only owners to delete organizations
DROP POLICY IF EXISTS "Organization owners can delete organizations" ON api.organizations;
CREATE POLICY "Organization owners can delete organizations" ON api.organizations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api.organization_members 
      WHERE organization_id = id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
    AND NOT is_global -- Prevent deletion of global organization
  );

----

-- Create tables for application APIs, services, and messages

-- Application APIs table
CREATE TABLE IF NOT EXISTS api.application_apis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  application_id UUID NOT NULL,
  status TEXT DEFAULT 'active',
  version TEXT,
  endpoint_url TEXT,
  documentation_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Application Services table
CREATE TABLE IF NOT EXISTS api.application_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  application_id UUID NOT NULL,
  status TEXT DEFAULT 'active',
  service_type TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Application Messages table
CREATE TABLE IF NOT EXISTS api.application_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  application_id UUID NOT NULL,
  message_type TEXT DEFAULT 'notification',
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add relationship between AI Tools and Application Services
ALTER TABLE api.ai_tools ADD COLUMN IF NOT EXISTS application_service_id UUID;

-- Add relationship table between Servers and Applications (many-to-many)
CREATE TABLE IF NOT EXISTS api.server_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL,
  application_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(server_id, application_id)
);

-- Add relationship table between Servers and AI Tools (many-to-many)
CREATE TABLE IF NOT EXISTS api.server_ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL,
  ai_tool_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(server_id, ai_tool_id)
);

-- RLS policies for Application APIs
ALTER TABLE api.application_apis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view application APIs they have access to" ON api.application_apis
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM api.applications a
    WHERE a.id = application_id
    AND a.organization_id IN (SELECT id FROM api.organizations WHERE is_public = TRUE)
  )
);

CREATE POLICY "Users can insert application APIs they have access to" ON api.application_apis
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can update application APIs they have access to" ON api.application_apis
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can delete application APIs they have access to" ON api.application_apis
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- RLS policies for Application Services
ALTER TABLE api.application_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view application services they have access to" ON api.application_services
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM api.applications a
    WHERE a.id = application_id
    AND a.organization_id IN (SELECT id FROM api.organizations WHERE is_public = TRUE)
  )
);

CREATE POLICY "Users can insert application services they have access to" ON api.application_services
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can update application services they have access to" ON api.application_services
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can delete application services they have access to" ON api.application_services
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- RLS policies for Application Messages
ALTER TABLE api.application_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view application messages they have access to" ON api.application_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM api.applications a
    WHERE a.id = application_id
    AND a.organization_id IN (SELECT id FROM api.organizations WHERE is_public = TRUE)
  )
);

CREATE POLICY "Users can insert application messages they have access to" ON api.application_messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'member')
  )
);

CREATE POLICY "Users can update application messages they have access to" ON api.application_messages
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can delete application messages they have access to" ON api.application_messages
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- RLS policies for server-application relationships
ALTER TABLE api.server_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view server applications they have access to" ON api.server_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM api.servers s
    JOIN api.organization_members om ON s.organization_id = om.organization_id
    WHERE s.id = server_id
    AND om.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM api.applications a
    JOIN api.organization_members om ON a.organization_id = om.organization_id
    WHERE a.id = application_id
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert server applications they have access to" ON api.server_applications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM api.servers s
    JOIN api.organization_members om ON s.organization_id = om.organization_id
    WHERE s.id = server_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can delete server applications they have access to" ON api.server_applications
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM api.servers s
    JOIN api.organization_members om ON s.organization_id = om.organization_id
    WHERE s.id = server_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- RLS policies for server-tools relationships
ALTER TABLE api.server_ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view server AI tools they have access to" ON api.server_ai_tools
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM api.servers s
    JOIN api.organization_members om ON s.organization_id = om.organization_id
    WHERE s.id = server_id
    AND om.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM api.ai_tools t
    JOIN api.organization_members om ON t.organization_id = om.organization_id
    WHERE t.id = ai_tool_id
    AND om.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert server AI tools they have access to" ON api.server_ai_tools
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM api.servers s
    JOIN api.organization_members om ON s.organization_id = om.organization_id
    WHERE s.id = server_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can delete server AI tools they have access to" ON api.server_ai_tools
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM api.servers s
    JOIN api.organization_members om ON s.organization_id = om.organization_id
    WHERE s.id = server_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);
