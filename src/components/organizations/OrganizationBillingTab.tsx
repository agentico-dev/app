
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CreditCard, Zap } from 'lucide-react';
import { Organization } from '@/types/organization';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OrganizationBillingTabProps {
  organization: Organization;
  isAuthenticated: boolean;
  isOrgMember: boolean;
}

export function OrganizationBillingTab({ 
  organization, 
  isAuthenticated, 
  isOrgMember 
}: OrganizationBillingTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Free Plan</h3>
              <p className="text-sm text-muted-foreground">Basic features for small organizations</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Current Plan</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-green-500" />
              <span>Up to 3 team members</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-green-500" />
              <span>5 projects</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-green-500" />
              <span>Basic analytics</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={!isAuthenticated || !isOrgMember}>
            <CreditCard className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods and billing history.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAuthenticated || !isOrgMember ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access restricted</AlertTitle>
              <AlertDescription>
                You need to sign in and be a member of this organization to view payment methods.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="text-center p-6">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No payment methods</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any payment methods yet.
              </p>
              <Button>
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
