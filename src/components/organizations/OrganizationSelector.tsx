
import { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Building, Search, PlusCircle } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { Organization, OrganizationSelectorProps } from '@/types/organization';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const OrganizationSelector = ({ 
  onOrganizationChange, 
  selectedOrgId,
  includeGlobal = true,
  className 
}: OrganizationSelectorProps) => {
  const { userOrganizations, isLoading } = useOrganizations();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Effect to load the previously selected organization from localStorage
  useEffect(() => {
    const savedOrgId = localStorage.getItem('selectedOrganizationId');
    if (savedOrgId && !selectedOrgId) {
      onOrganizationChange(savedOrgId);
    }
  }, []);

  useEffect(() => {
    if (userOrganizations && userOrganizations.length > 0) {
      // Filter organizations based on the search query and if global should be included
      let orgs = [...userOrganizations];
      
      if (!includeGlobal) {
        orgs = orgs.filter(org => !org.is_global);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        orgs = orgs.filter(org => 
          org.name.toLowerCase().includes(query) || 
          (org.description && org.description.toLowerCase().includes(query))
        );
      }
      
      setFilteredOrgs(orgs);
      
      // Set the selected organization
      if (selectedOrgId) {
        const org = userOrganizations.find(o => o.id === selectedOrgId);
        if (org) {
          setSelectedOrg(org);
        }
      } else if (userOrganizations.length > 0) {
        // Default to first organization if none selected
        setSelectedOrg(userOrganizations[0]);
        onOrganizationChange(userOrganizations[0].id);
      }
    }
  }, [userOrganizations, searchQuery, selectedOrgId, includeGlobal, onOrganizationChange]);

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    onOrganizationChange(org.id);
    setIsOpen(false);
  };

  const handleCreateOrg = () => {
    navigate('/orgs');
    setIsOpen(false);
  };

  const getOrgInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("flex items-center justify-between w-full", className)}
          disabled={isLoading}
        >
          {selectedOrg ? (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                {selectedOrg.logo_url ? (
                  <img src={selectedOrg.logo_url} alt={selectedOrg.name} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {getOrgInitials(selectedOrg.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="truncate max-w-[150px]">{selectedOrg.name}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              <span>{isLoading ? "Loading..." : "Select Organization"}</span>
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <DropdownMenuLabel>Your Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {filteredOrgs.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No organizations found
            </div>
          ) : (
            filteredOrgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                className="cursor-pointer flex items-center justify-between"
                onClick={() => handleSelectOrg(org)}
              >
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt={org.name} />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {getOrgInitials(org.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{org.name}</div>
                    {org.is_global && (
                      <div className="text-xs text-muted-foreground">Global</div>
                    )}
                  </div>
                </div>
                {selectedOrg?.id === org.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer flex items-center gap-2"
          onClick={handleCreateOrg}
        >
          <PlusCircle className="h-4 w-4" />
          Create New Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSelector;
