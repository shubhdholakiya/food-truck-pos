import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  useModifierGroups,
  useModifiers,
  useCreateModifierGroup,
  useUpdateModifierGroup,
  useDeleteModifierGroup,
  useCreateModifier,
  useUpdateModifier,
  useDeleteModifier,
  type ModifierGroup,
  type Modifier,
} from '@/api/menu';

const modifierGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  min: z.number().min(0),
  max: z.number().min(1),
  sortOrder: z.number().min(0),
  isActive: z.boolean(),
});

const modifierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  priceDelta: z.string(),
  sortOrder: z.number().min(0),
  isActive: z.boolean(),
});

type ModifierGroupFormData = z.infer<typeof modifierGroupSchema>;
type ModifierFormData = z.infer<typeof modifierSchema>;

export default function ModifiersTab() {
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroup | null>(null);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [editingModifier, setEditingModifier] = useState<Modifier | null>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [modifierDialogOpen, setModifierDialogOpen] = useState(false);

  const { data: modifierGroups = [], isLoading: groupsLoading } = useModifierGroups();
  const { data: modifiers = [], isLoading: modifiersLoading } = useModifiers(selectedGroup?.id);
  
  const createGroupMutation = useCreateModifierGroup();
  const updateGroupMutation = useUpdateModifierGroup();
  const deleteGroupMutation = useDeleteModifierGroup();
  const createModifierMutation = useCreateModifier();
  const updateModifierMutation = useUpdateModifier();
  const deleteModifierMutation = useDeleteModifier();

  const groupForm = useForm<ModifierGroupFormData>({
    resolver: zodResolver(modifierGroupSchema),
    defaultValues: {
      name: '',
      min: 0,
      max: 1,
      sortOrder: 0,
      isActive: true,
    },
  });

  const modifierForm = useForm<ModifierFormData>({
    resolver: zodResolver(modifierSchema),
    defaultValues: {
      name: '',
      priceDelta: '0.00',
      sortOrder: 0,
      isActive: true,
    },
  });

  const handleGroupSubmit = async (data: ModifierGroupFormData) => {
    try {
      if (editingGroup) {
        await updateGroupMutation.mutateAsync({ id: editingGroup.id, ...data });
      } else {
        await createGroupMutation.mutateAsync(data);
      }
      setGroupDialogOpen(false);
      setEditingGroup(null);
      groupForm.reset();
    } catch (error) {
      // Error handled by mutation hooks
    }
  };

  const handleModifierSubmit = async (data: ModifierFormData) => {
    if (!selectedGroup) return;
    
    try {
      const modifierData = { ...data, groupId: selectedGroup.id };
      if (editingModifier) {
        await updateModifierMutation.mutateAsync({ id: editingModifier.id, ...modifierData });
      } else {
        await createModifierMutation.mutateAsync(modifierData);
      }
      setModifierDialogOpen(false);
      setEditingModifier(null);
      modifierForm.reset();
    } catch (error) {
      // Error handled by mutation hooks
    }
  };

  const handleEditGroup = (group: ModifierGroup) => {
    setEditingGroup(group);
    groupForm.reset({
      name: group.name,
      min: group.min,
      max: group.max,
      sortOrder: group.sortOrder,
      isActive: group.isActive,
    });
    setGroupDialogOpen(true);
  };

  const handleEditModifier = (modifier: Modifier) => {
    setEditingModifier(modifier);
    modifierForm.reset({
      name: modifier.name,
      priceDelta: modifier.priceDelta,
      sortOrder: modifier.sortOrder,
      isActive: modifier.isActive,
    });
    setModifierDialogOpen(true);
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm('Are you sure you want to delete this modifier group?')) {
      await deleteGroupMutation.mutateAsync(id);
      if (selectedGroup?.id === id) {
        setSelectedGroup(null);
      }
    }
  };

  const handleDeleteModifier = async (id: string) => {
    if (confirm('Are you sure you want to delete this modifier?')) {
      await deleteModifierMutation.mutateAsync(id);
    }
  };

  const openNewGroupDialog = () => {
    setEditingGroup(null);
    groupForm.reset({
      name: '',
      min: 0,
      max: 1,
      sortOrder: 0,
      isActive: true,
    });
    setGroupDialogOpen(true);
  };

  const openNewModifierDialog = () => {
    setEditingModifier(null);
    modifierForm.reset({
      name: '',
      priceDelta: '0.00',
      sortOrder: 0,
      isActive: true,
    });
    setModifierDialogOpen(true);
  };

  if (groupsLoading) {
    return <div>Loading modifier groups...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Modifier Groups */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Modifier Groups</CardTitle>
            <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewGroupDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingGroup ? 'Edit Modifier Group' : 'Create Modifier Group'}
                  </DialogTitle>
                </DialogHeader>
                <Form {...groupForm}>
                  <form onSubmit={groupForm.handleSubmit(handleGroupSubmit)} className="space-y-4">
                    <FormField
                      control={groupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Group name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={groupForm.control}
                        name="min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={groupForm.control}
                        name="max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={groupForm.control}
                      name="sortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Order</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={groupForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Active</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setGroupDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
                      >
                        {editingGroup ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modifierGroups.map((group) => (
                <TableRow 
                  key={group.id}
                  className={selectedGroup?.id === group.id ? 'bg-muted' : 'cursor-pointer'}
                  onClick={() => setSelectedGroup(group)}
                >
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.min}/{group.max}</TableCell>
                  <TableCell>
                    <Badge variant={group.isActive ? 'default' : 'secondary'}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(group);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                        disabled={deleteGroupMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modifiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Modifiers {selectedGroup && `- ${selectedGroup.name}`}
            </CardTitle>
            {selectedGroup && (
              <Dialog open={modifierDialogOpen} onOpenChange={setModifierDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewModifierDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Modifier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingModifier ? 'Edit Modifier' : 'Create Modifier'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...modifierForm}>
                    <form onSubmit={modifierForm.handleSubmit(handleModifierSubmit)} className="space-y-4">
                      <FormField
                        control={modifierForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Modifier name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={modifierForm.control}
                        name="priceDelta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Delta</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0.00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={modifierForm.control}
                        name="sortOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={modifierForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel>Active</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setModifierDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={createModifierMutation.isPending || updateModifierMutation.isPending}
                        >
                          {editingModifier ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!selectedGroup ? (
            <div className="text-center text-muted-foreground py-8">
              Select a modifier group to view its modifiers
            </div>
          ) : modifiersLoading ? (
            <div>Loading modifiers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price Delta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modifiers.map((modifier) => (
                  <TableRow key={modifier.id}>
                    <TableCell className="font-medium">{modifier.name}</TableCell>
                    <TableCell>${modifier.priceDelta}</TableCell>
                    <TableCell>
                      <Badge variant={modifier.isActive ? 'default' : 'secondary'}>
                        {modifier.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditModifier(modifier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteModifier(modifier.id)}
                          disabled={deleteModifierMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}