import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChefHat, CreditCard, Users, MapPin, User } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import MetricsCards from "@/components/dashboard/MetricsCards";
import RecentOrders from "@/components/dashboard/RecentOrders";
import QuickActions from "@/components/dashboard/QuickActions";
import TopItems from "@/components/dashboard/TopItems";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopBar />

      <div className="flex flex-1">
        {/* Yes — this page already has a Sidebar */}
        <Sidebar />

        <main className="flex-1 overflow-hidden">
          <div className="p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your food truck today.
              </p>
            </div>

            {/* Quick navigation to the new pages */}
            <div className="mb-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <Button asChild variant="secondary" className="justify-start gap-2">
                <Link href="/orders">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" className="justify-start gap-2">
                <Link href="/kitchen">
                  <ChefHat className="h-4 w-4" />
                  <span>Kitchen</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" className="justify-start gap-2">
                <Link href="/payments">
                  <CreditCard className="h-4 w-4" />
                  <span>Payments</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" className="justify-start gap-2">
                <Link href="/staff">
                  <Users className="h-4 w-4" />
                  <span>Staff</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" className="justify-start gap-2">
                <Link href="/locations">
                  <MapPin className="h-4 w-4" />
                  <span>Locations</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" className="justify-start gap-2">
                <Link href="/profile">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            </div>

            {/* Key Metrics */}
            <MetricsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <RecentOrders />
              </div>

              {/* Quick Actions & Top Items */}
              <div className="space-y-6">
                <QuickActions />
                <TopItems />
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
