import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Menu as MenuIcon, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard,
    exact: true 
  },
  { 
    name: "Sales", 
    href: "/sales", 
    icon: ShoppingCart 
  },
  { 
    name: "Menu", 
    href: "/menu", 
    icon: MenuIcon 
  },
  { 
    name: "Inventory", 
    href: "/inventory", 
    icon: Package 
  },
  { 
    name: "Customers", 
    href: "/customers", 
    icon: Users 
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: BarChart3 
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings 
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <aside className="hidden md:block w-64 bg-white material-shadow border-r border-gray-200 relative">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                active 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* System Status */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-secondary text-sm font-medium">
            <Wifi className="h-4 w-4" />
            <span>Online & Synced</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">Last sync: 2 minutes ago</div>
        </div>
      </div>
    </aside>
  );
}
