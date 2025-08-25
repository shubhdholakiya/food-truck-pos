import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCategories, useItems, useModifierGroups } from '@/api/menu';
import CategoriesTab from './CategoriesTab';
import ItemsTab from './ItemsTab';
import ModifiersTab from './ModifiersTab';

export default function MenuPage() {
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useItems();
  const { data: modifierGroups = [] } = useModifierGroups();

  return (
    // ✅ Container: centers + adds horizontal padding like your other pages
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant menu categories, items, and modifiers.
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        {/* ✅ Tabs bar with a subtle container */}
        <div className="rounded-xl border bg-background p-1">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              Categories <Badge variant="secondary">{categories.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              Items <Badge variant="secondary">{items.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="modifiers" className="flex items-center gap-2">
              Modifiers <Badge variant="secondary">{modifierGroups.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ✅ Each tab is a padded card; tables won’t touch edges */}
        <TabsContent value="categories">
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="overflow-x-auto">
              <CategoriesTab />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="items">
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="overflow-x-auto">
              <ItemsTab />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="modifiers">
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="overflow-x-auto">
              <ModifiersTab />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
