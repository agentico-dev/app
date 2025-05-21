import { Link } from "react-router";

interface OrganizationLevelWarningProps {
  isOrganizationLevel: boolean;
}

export function OrganizationLevelWarning({ isOrganizationLevel }: OrganizationLevelWarningProps) {
  if (!isOrganizationLevel) return null;
  
  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4 rounded">
      <p className="font-medium">Tools listed are at organization level.</p>
      <p className="text-sm">Associate this server with a <Link to="/projects" className="text-blue-500 hover:underline">
        project</Link> to see project-specific tools.</p>
    </div>
  );
}
