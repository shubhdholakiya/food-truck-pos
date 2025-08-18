// client/src/pages/landing.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp, Users, BarChart3 } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function Landing() {
  const goLogin = async () => {
    try {
      // set cookie on the API origin via credentialed fetch
      await fetch(`${API_BASE_URL}/api/dev-login`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore dev errors
    }
    // then go to a visible route
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Store className="h-16 w-16 text-primary mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              FoodTruck POS
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The modern point-of-sale solution designed specifically for food trucks and micro-restaurants.
            Streamline your operations, track inventory, and grow your business.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg" onClick={goLogin}>
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="material-shadow hover:material-shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sales Management</h3>
              <p className="text-gray-600">
                Process orders quickly with our touch-friendly interface. Accept multiple payment methods including card, mobile, and cash.
              </p>
            </CardContent>
          </Card>
          <Card className="material-shadow hover:material-shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Build customer relationships with automated profiles, purchase history tracking, and loyalty rewards.
              </p>
            </CardContent>
          </Card>
          <Card className="material-shadow hover:material-shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">
                Get insights into your business with detailed sales reports, inventory tracking, and performance analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="material-shadow-lg bg-primary text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Food Truck?</h2>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Join thousands of food truck owners who trust FoodTruck POS to manage their business operations.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100" onClick={goLogin}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}