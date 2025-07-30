import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, QrCode, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QRGenerator() {
  const [qrSize, setQrSize] = useState(200);
  const [customDomain, setCustomDomain] = useState("");
  const { toast } = useToast();

  // Get current domain or use custom domain
  const baseUrl = customDomain || window.location.origin;
  const qrMenuUrl = `${baseUrl}/qr-menu`;
  const customerOrderUrl = `${baseUrl}/order`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generateQRCode = (url: string, size: number) => {
    // Using QR Server API for QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
  };

  const downloadQR = (url: string, filename: string) => {
    const qrUrl = generateQRCode(url, 400); // High resolution for download
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
        </div>
        <p className="text-gray-600">Generate QR codes for your customer-facing menu and ordering system</p>
      </div>

      {/* Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qrSize">QR Code Size (pixels)</Label>
            <Input
              id="qrSize"
              type="number"
              value={qrSize}
              onChange={(e) => setQrSize(parseInt(e.target.value) || 200)}
              min={100}
              max={500}
              className="max-w-xs"
            />
          </div>
          <div>
            <Label htmlFor="customDomain">Custom Domain (optional)</Label>
            <Input
              id="customDomain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="https://yourdomain.com"
              className="max-w-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to use current domain: {window.location.origin}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Options */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Simple Menu Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Option 1: Simple Menu Display</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Customers scan to view your menu. Orders are placed at the counter.
            </p>
            
            <div className="text-center">
              <img 
                src={generateQRCode(qrMenuUrl, qrSize)} 
                alt="QR Menu Code"
                className="mx-auto border rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>URL:</Label>
              <div className="flex space-x-2">
                <Input value={qrMenuUrl} readOnly className="text-sm" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(qrMenuUrl, "Menu URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => downloadQR(qrMenuUrl, "menu-qr-code")}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(qrMenuUrl, '_blank')}
                className="flex-1"
              >
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Customer Ordering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Option 2: Customer Ordering System</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Customers can browse, add to cart, and place orders online with cash or card payment.
            </p>
            
            <div className="text-center">
              <img 
                src={generateQRCode(customerOrderUrl, qrSize)} 
                alt="Customer Order QR Code"
                className="mx-auto border rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>URL:</Label>
              <div className="flex space-x-2">
                <Input value={customerOrderUrl} readOnly className="text-sm" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(customerOrderUrl, "Order URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => downloadQR(customerOrderUrl, "order-qr-code")}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(customerOrderUrl, '_blank')}
                className="flex-1"
              >
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">For Table Service:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Print QR codes and place them on tables</li>
                <li>Customers scan with their phone camera</li>
                <li>Menu opens in their browser - no app needed</li>
                <li>Orders appear in your admin dashboard in real-time</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">For Counter Service:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Display QR code near your counter or window</li>
                <li>Customers can browse while waiting in line</li>
                <li>Speeds up ordering process</li>
                <li>Reduces contact for health safety</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">For Food Truck Events:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Display QR codes on your truck's exterior</li>
                <li>Include in social media posts</li>
                <li>Share via text or messaging apps</li>
                <li>Print on business cards or flyers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}