// src/components/admin/PromoCodesManager.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  useGeneratePromoCodesMutation,
  useGetPromoCodesQuery,
  useDeactivatePromoCodeMutation,
  PromoCode
} from '@/app/api/promoCodeApiSlice';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import {
  Copy,
  Download,
  Gift,
  Loader2,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PromoCodesManager() {
  const { user } = useAuth();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Form state
  const [generationForm, setGenerationForm] = useState({
    count: 20,
    prefix: 'LAUNCH',
    duration: 30,
    maxUses: 1,
    description: 'Free month of Pro access',
    expiryDays: 90
  });
  
  // API hooks
  const { data: promoCodesData, isLoading: isLoadingCodes, refetch } = useGetPromoCodesQuery({ 
    active: showActive 
  });
  const [generatePromoCodes, { isLoading: isGenerating }] = useGeneratePromoCodesMutation();
  const [deactivatePromoCode, { isLoading: isDeactivating }] = useDeactivatePromoCodeMutation();
  
  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setGenerationForm({
        ...generationForm,
        [name]: type === 'number' 
          ? (value === '' ? '' : parseInt(value, 10)) 
          : value
      });
    };
  // Handle generate codes
  const handleGenerateCodes = async () => {
    try {
      await generatePromoCodes(generationForm).unwrap();
      toast.success(`Generated ${generationForm.count} promo codes successfully`);
      setIsGenerateDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to generate promo codes');
    }
  };
  
  // Handle deactivate code
  const handleDeactivateCode = async (codeId: string) => {
    try {
      await deactivatePromoCode(codeId).unwrap();
      toast.success('Promo code deactivated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to deactivate promo code');
    }
  };
  
  // Handle copy code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Promo code copied to clipboard');
  };
  
  // Handle view details
  const handleViewDetails = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setIsDetailsDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Export codes as CSV
  const exportCodes = () => {
    if (!promoCodesData || !promoCodesData.promoCodes.length) return;
    
    const csvContent = [
      ['Code', 'Description', 'Duration (days)', 'Max Uses', 'Used Count', 'Active', 'Expires At'],
      ...promoCodesData.promoCodes.map(code => [
        code.code,
        code.description,
        code.duration.toString(),
        code.maxUses.toString(),
        code.usedCount.toString(),
        code.isActive ? 'Yes' : 'No',
        formatDate(code.expiresAt)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `promo-codes-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promo Codes</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="active-switch"
              checked={showActive}
              onCheckedChange={setShowActive}
            />
            <Label htmlFor="active-switch">Show Active</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCodes}
            disabled={!promoCodesData || !promoCodesData.promoCodes.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setIsGenerateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Codes
          </Button>
        </div>
      </div>
      
      {/* Promo Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            <span>{showActive ? 'Active' : 'All'} Promo Codes</span>
            {isLoadingCodes && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </CardTitle>
          <CardDescription>
            {showActive 
              ? 'Currently active promo codes that can be redeemed by users'
              : 'All promo codes including expired and fully redeemed ones'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCodes ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !promoCodesData?.promoCodes.length ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No promo codes found</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodesData.promoCodes.map((code) => (
                    <TableRow key={code._id}>
                      <TableCell className="font-mono font-medium">
                        {code.code}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() => handleCopyCode(code.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TableCell>
                      <TableCell>{code.duration} days</TableCell>
                      <TableCell>
                        {code.usedCount}/{code.maxUses}
                      </TableCell>
                      <TableCell>
                        {code.isActive ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(code.expiresAt)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(code)}
                        >
                          Details
                        </Button>
                        {code.isActive && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeactivateCode(code._id)}
                            disabled={isDeactivating}
                          >
                            Deactivate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Total: {promoCodesData?.count || 0} promo codes
        </CardFooter>
      </Card>

      {/* Generate Codes Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Promo Codes</DialogTitle>
            <DialogDescription>
              Create new promotional codes for users to redeem. Each code gives free access to Pro features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Codes</Label>
                <Input
                  id="count"
                  name="count"
                  type="number"
                  min={1}
                  max={100}
                  value={generationForm.count}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prefix">Code Prefix</Label>
                <Input
                  id="prefix"
                  name="prefix"
                  value={generationForm.prefix}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min={1}
                  max={365}
                  value={generationForm.duration}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses Per Code</Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  min={1}
                  value={generationForm.maxUses}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={generationForm.description}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDays">Code Validity (days)</Label>
              <Input
                id="expiryDays"
                name="expiryDays"
                type="number"
                min={1}
                value={generationForm.expiryDays}
                onChange={handleFormChange}
              />
              <p className="text-xs text-muted-foreground">
                This is how long the codes can be redeemed, not the duration of Pro access.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGenerateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateCodes}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Code Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Promo Code Details</DialogTitle>
            <DialogDescription>
              View detailed information about this promotional code.
            </DialogDescription>
          </DialogHeader>
          {selectedPromoCode && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold font-mono">{selectedPromoCode.code}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPromoCode.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(selectedPromoCode.code)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <div>
                    {selectedPromoCode.isActive ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                        <XCircle className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm">
                    {selectedPromoCode.createdBy?.name || "Admin"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm">{selectedPromoCode.duration} days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Usage</p>
                  <p className="text-sm">{selectedPromoCode.usedCount}/{selectedPromoCode.maxUses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Expires</p>
                  <p className="text-sm flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDate(selectedPromoCode.expiresAt)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Used By</p>
                {selectedPromoCode.usedBy.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No redemptions yet</p>
                ) : (
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    <div className="space-y-3">
                      {selectedPromoCode.usedBy.map((usage, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="font-medium text-sm">
                              {usage.userId.name}
                            </div>
                            <div className="ml-2 text-xs text-muted-foreground">
                              {usage.userId.email}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(usage.usedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedPromoCode?.isActive && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeactivateCode(selectedPromoCode._id);
                  setIsDetailsDialogOpen(false);
                }}
                disabled={isDeactivating}
              >
                {isDeactivating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deactivating...
                  </>
                ) : (
                  'Deactivate Code'
                )}
              </Button>
            )}
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}