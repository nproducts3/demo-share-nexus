
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiKey } from '../../types/settings';

export const ApiKeysTab = () => {
  const { toast } = useToast();
  const [showNewApiKeyForm, setShowNewApiKeyForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ name: '', permissions: [] as string[] });
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('apiKeys');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Production API',
        key: 'dk_live_1234567890abcdef',
        permissions: ['read', 'write'],
        created: '2024-01-15',
        lastUsed: '2 hours ago',
        isActive: true
      },
      {
        id: '2',
        name: 'Development API',
        key: 'dk_test_0987654321fedcba',
        permissions: ['read'],
        created: '2024-01-10',
        lastUsed: '1 day ago',
        isActive: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const handleAddApiKey = () => {
    if (!newApiKey.name || newApiKey.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a name and select at least one permission.",
        variant: "destructive"
      });
      return;
    }

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKey.name,
      key: `dk_${Math.random().toString(36).substr(2, 20)}`,
      permissions: newApiKey.permissions,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      isActive: true
    };

    setApiKeys([...apiKeys, apiKey]);
    setNewApiKey({ name: '', permissions: [] });
    setShowNewApiKeyForm(false);
    
    toast({
      title: "API Key Created",
      description: "New API key has been generated successfully.",
    });
  };

  const handleRevokeApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, isActive: false } : key
    ));
    toast({
      title: "API Key Revoked",
      description: `${key?.name} has been revoked and is no longer valid.`,
    });
  };

  const handleDeleteApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: `${key?.name} has been permanently deleted.`,
    });
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to Clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const togglePermission = (permission: string) => {
    setNewApiKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Key className="h-5 w-5 mr-2 text-purple-600" />
            API Keys ({apiKeys.filter(k => k.isActive).length} active)
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewApiKeyForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Key
          </Button>
        </CardTitle>
        <CardDescription>
          Manage API keys for external integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showNewApiKeyForm && (
          <Card className="mb-6 border border-purple-200 bg-purple-50/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-name">Key Name *</Label>
                  <Input
                    id="api-name"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                    placeholder="Enter a descriptive name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Permissions *</Label>
                  <div className="flex flex-wrap gap-2">
                    {['read', 'write', 'delete', 'admin'].map((permission) => (
                      <Button
                        key={permission}
                        variant={newApiKey.permissions.includes(permission) ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePermission(permission)}
                      >
                        {permission}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewApiKeyForm(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddApiKey}>
                  Generate Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-slate-900">{apiKey.name}</p>
                  {!apiKey.isActive && <Badge variant="secondary">Revoked</Badge>}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-slate-600 font-mono">{apiKey.key}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyApiKey(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2 mt-2">
                  {apiKey.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Created: {apiKey.created}</p>
                <p className="text-sm text-slate-600">Last used: {apiKey.lastUsed}</p>
                <div className="flex space-x-2 mt-2">
                  {apiKey.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeApiKey(apiKey.id)}
                    >
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteApiKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
