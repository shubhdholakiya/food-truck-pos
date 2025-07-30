import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Menu as MenuIcon, 
  Package, 
  MoreHorizontal
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
    name: "More", 
    href: "/more", 
    icon: MoreHorizontal 
  },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 material-shadow-lg">
      <div className="flex">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex-1 flex flex-col items-center py-2 px-1 transition-colors cursor-pointer",
                active ? "text-primary" : "text-gray-600"
              )}>
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
