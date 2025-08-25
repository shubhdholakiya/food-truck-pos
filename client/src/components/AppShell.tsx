import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Menu,
  ShoppingCart,
  ChefHat,
  CreditCard,
  Users,
  Package,
  BarChart3,
  Settings,
  MenuIcon,
} from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Menu',
    href: '/menu',
    icon: Menu,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Kitchen',
    href: '/kitchen',
    icon: ChefHat,
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-950 border-r">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-xl font-semibold">Eataz POS</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-primary text-primary-foreground'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}