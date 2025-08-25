import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Types (match backend JSON)
export type Category = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
};

export type MenuItem = {
  id: string;
  categoryId: string | null;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ModifierGroup = {
  id: string;
  name: string;
  min: number;
  max: number;
  sortOrder: number;
  isActive: boolean;
};

export type Modifier = {
  id: string;
  groupId: string;
  name: string;
  priceDelta: string;
  sortOrder: number;
  isActive: boolean;
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['/api/menu/categories'],
    queryFn: () => get<Category[]>('/api/menu/categories'),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'createdAt'>) => 
      post<Category>('/api/menu/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/categories'] });
      toast({ title: "Category created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating category", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Category> & { id: string }) => 
      put<Category>(`/api/menu/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/categories'] });
      toast({ title: "Category updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating category", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => del(`/api/menu/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/categories'] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting category", description: error.message, variant: "destructive" });
    },
  });
};

// Menu Items
export const useItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ['/api/menu/items', categoryId],
    queryFn: () => {
      const url = categoryId ? `/api/menu/items?categoryId=${categoryId}` : '/api/menu/items';
      return get<MenuItem[]>(url);
    },
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => 
      post<MenuItem>('/api/menu/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/items'] });
      toast({ title: "Menu item created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating menu item", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<MenuItem> & { id: string }) => 
      put<MenuItem>(`/api/menu/items/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/items'] });
      toast({ title: "Menu item updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating menu item", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => del(`/api/menu/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/items'] });
      toast({ title: "Menu item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting menu item", description: error.message, variant: "destructive" });
    },
  });
};

// Modifier Groups
export const useModifierGroups = () => {
  return useQuery({
    queryKey: ['/api/menu/modifier-groups'],
    queryFn: () => get<ModifierGroup[]>('/api/menu/modifier-groups'),
  });
};

export const useCreateModifierGroup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: Omit<ModifierGroup, 'id'>) => 
      post<ModifierGroup>('/api/menu/modifier-groups', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/modifier-groups'] });
      toast({ title: "Modifier group created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating modifier group", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateModifierGroup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ModifierGroup> & { id: string }) => 
      put<ModifierGroup>(`/api/menu/modifier-groups/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/modifier-groups'] });
      toast({ title: "Modifier group updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating modifier group", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteModifierGroup = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => del(`/api/menu/modifier-groups/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/modifier-groups'] });
      toast({ title: "Modifier group deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting modifier group", description: error.message, variant: "destructive" });
    },
  });
};

// Modifiers
export const useModifiers = (groupId?: string) => {
  return useQuery({
    queryKey: ['/api/menu/modifiers', groupId],
    queryFn: () => {
      const url = groupId ? `/api/menu/modifiers?groupId=${groupId}` : '/api/menu/modifiers';
      return get<Modifier[]>(url);
    },
    enabled: !!groupId,
  });
};

export const useCreateModifier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: Omit<Modifier, 'id'>) => 
      post<Modifier>('/api/menu/modifiers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/modifiers'] });
      toast({ title: "Modifier created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating modifier", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateModifier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Modifier> & { id: string }) => 
      put<Modifier>(`/api/menu/modifiers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/modifiers'] });
      toast({ title: "Modifier updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating modifier", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteModifier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => del(`/api/menu/modifiers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/modifiers'] });
      toast({ title: "Modifier deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting modifier", description: error.message, variant: "destructive" });
    },
  });
};