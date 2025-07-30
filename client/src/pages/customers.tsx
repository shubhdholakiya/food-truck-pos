import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Customers() {
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
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Customer Directory</h2>
              <p className="text-gray-600">Manage customer information and loyalty programs</p>
            </div>
            
            {/* Customer management content will be implemented here */}
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Customer management coming soon...</p>
            </div>
          </div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
