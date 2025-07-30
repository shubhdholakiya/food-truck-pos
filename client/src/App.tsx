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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public customer-facing routes */}
      <Route path="/order" component={CustomerMenu} />
      <Route path="/qr-menu" component={QRMenu} />
      
      {/* Admin routes (authentication required) */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/sales" component={Sales} />
          <Route path="/menu" component={Menu} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/customers" component={Customers} />
          <Route path="/reports" component={Reports} />
          <Route path="/qr-generator" component={QRGenerator} />
        </>
      )}
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
