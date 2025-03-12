
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, UserPlus } from 'lucide-react';
import { Organization, OrganizationMember } from '@/types/organization';
import { useOrganizationMembers } from '@/hooks/useOrganizations';

interface OrganizationTeamsTabProps {
  organization: Organization;
  members: OrganizationMember[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isOrgMember: boolean;
}

export function OrganizationTeamsTab({ 
  organization, 
  members, 
  isLoading, 
  isAuthenticated, 
  isOrgMember 
}: OrganizationTeamsTabProps) {
  const { addMember } = useOrganizationMembers(organization.id);
  const [open, setOpen] = React.useState(false);
  const [newMember, setNewMember] = React.useState({
    email: '',
    role: 'member' as 'admin' | 'member',
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember.mutateAsync(newMember);
      setOpen(false);
      setNewMember({ email: '', role: 'member' });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your organization's team members.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-5 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your organization's team members.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={!isAuthenticated || !isOrgMember}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite team member</DialogTitle>
              <DialogDescription>
                Add a new member to your organization. They will receive an email invitation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMember}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="coworker@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newMember.role} 
                    onValueChange={(value: 'admin' | 'member') => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addMember.isPending}>
                  {addMember.isPending ? 'Inviting...' : 'Invite Member'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center p-6">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No team members yet</h3>
            <p className="text-muted-foreground mb-4">
              Invite team members to collaborate with you in this organization.
            </p>
            {isAuthenticated && isOrgMember && (
              <Button onClick={() => setOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.user_id.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user_id}</p>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </div>
                {isAuthenticated && isOrgMember && member.role !== 'owner' && (
                  <Button variant="outline" size="sm" disabled={!isOrgMember}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
