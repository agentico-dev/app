import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash, Badge } from 'lucide-react';

const EnvironmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app you would fetch this data
  const [environment, setEnvironment] = useState({
    id: id,
    name: id === '1' ? 'Development' : id === '2' ? 'Staging' : 'Production',
    key: id === '1' ? 'dev' : id === '2' ? 'staging' : 'prod',
    isDefault: id === '1',
  });

  const [variables, setVariables] = useState([
    { key: 'API_URL', value: 'https://api.example.com', isSecret: false },
    { key: 'DEBUG_MODE', value: 'true', isSecret: false },
    { key: 'API_KEY', value: '********', isSecret: true },
  ]);

  const [newVar, setNewVar] = useState({ key: '', value: '', isSecret: false });

  const handleSave = () => {
    // In a real app, you would save the changes to your backend
    toast.success('Environment settings saved!');
  };

  const addVariable = () => {
    if (newVar.key && newVar.value) {
      setVariables([...variables, { ...newVar }]);
      setNewVar({ key: '', value: '', isSecret: false });
    } else {
      toast.error('Both key and value are required');
    }
  };

  const removeVariable = (indexToRemove: number) => {
    setVariables(variables.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/settings/environments')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Environments
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Environment: {environment.name}</CardTitle>
          <CardDescription>Configure settings for this environment</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="variables">Environment Variables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Environment Name</Label>
                  <Input 
                    id="name" 
                    value={environment.name} 
                    onChange={(e) => setEnvironment({...environment, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="key">Environment Key</Label>
                  <Input 
                    id="key" 
                    value={environment.key} 
                    onChange={(e) => setEnvironment({...environment, key: e.target.value})}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This key is used in configuration files to reference this environment.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDefault"
                    checked={environment.isDefault}
                    onCheckedChange={(checked) => 
                      setEnvironment({...environment, isDefault: checked as boolean})
                    }
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Set as default environment
                  </label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="variables">
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Add New Variable</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="var-key">Key</Label>
                      <Input 
                        id="var-key" 
                        value={newVar.key} 
                        onChange={(e) => setNewVar({...newVar, key: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="var-value">Value</Label>
                      <Input 
                        id="var-value" 
                        value={newVar.value} 
                        onChange={(e) => setNewVar({...newVar, value: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center space-x-2 mr-4">
                        <Checkbox 
                          id="isSecret"
                          checked={newVar.isSecret}
                          onCheckedChange={(checked) => 
                            setNewVar({...newVar, isSecret: checked as boolean})
                          }
                        />
                        <label
                          htmlFor="isSecret"
                          className="text-sm font-medium leading-none"
                        >
                          Secret
                        </label>
                      </div>
                      <Button onClick={addVariable}>Add</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Key</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-gray-200">
                        {variables.map((variable, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">{variable.key}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{variable.isSecret ? '********' : variable.value}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {variable.isSecret ? (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                  Secret
                                </Badge>
                              ) : (
                                <Badge>Plain</Badge>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeVariable(index)}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnvironmentDetailPage;
