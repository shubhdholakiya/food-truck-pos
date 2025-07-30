import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Store, Search, Bell, Menu, ChevronDown } from "lucide-react";

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="bg-primary text-white material-shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="md:hidden text-white hover:bg-white/10 p-2">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8" />
            <h1 className="text-xl font-medium">FoodTruck POS</h1>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Input 
              type="text" 
              placeholder="Search menu items, customers..." 
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-all duration-200"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" className="relative text-white hover:bg-white/10 p-2 rounded-full">
            <Bell className="h-6 w-6" />
            <Badge className="absolute -top-1 -right-1 bg-accent text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10 p-2 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={(user as any)?.profileImageUrl} alt={(user as any)?.firstName || "User"} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm text-left">
                  <div>{(user as any)?.firstName && (user as any)?.lastName ? `${(user as any).firstName} ${(user as any).lastName}` : (user as any)?.email}</div>
                  <div className="text-white/70 capitalize">{(user as any)?.role || "User"}</div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
