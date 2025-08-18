import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Sales from "@/pages/sales";
import Menu from "@/pages/menu";
import Inventory from "@/pages/inventory";
import Customers from "@/pages/customers";
import Reports from "@/pages/reports";
import CustomerMenu from "@/pages/customer-menu";
import QRMenu from "@/pages/qr-menu";
import QRGenerator from "@/pages/qr-generator";
import Orders from "@/pages/orders";
import Payments from "@/pages/payments";
import Settings from "@/pages/settings";
import Staff from "@/pages/staff";
import Locations from "@/pages/locations";
import Kitchen from "@/pages/kitchen";
import Profile from "@/pages/profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public customer-facing routes */}
      <Route path="/order" component={CustomerMenu} />
      <Route path="/qr-menu" component={QRMenu} />

      {/* Admin routes (authentication required) */}
      {isLoading || !isAuthenticated ? (
        // While loading or unauthenticated, only expose the landing on "/"
        <Route path="/" component={Landing} />
      ) : (
        <>
          {/* Root can be dashboard for convenience */}
          <Route path="/" component={Dashboard} />
          {/* Explicit dashboard path so our login redirect works */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/sales" component={Sales} />
          <Route path="/menu" component={Menu} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/customers" component={Customers} />
          <Route path="/reports" component={Reports} />
          <Route path="/qr-generator" component={QRGenerator} />
          <Route path="/orders" component={Orders} />
          <Route path="/payments" component={Payments} />
          <Route path="/settings" component={Settings} />
          <Route path="/staff" component={Staff} />
          <Route path="/locations" component={Locations} />
          <Route path="/kitchen" component={Kitchen} />
          <Route path="/profile" component={Profile} />
        </>
      )}

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
