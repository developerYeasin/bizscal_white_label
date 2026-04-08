"use client";

import React from "react";
import { CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Copy, Trash2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx"; // Import CollapsibleCard

const ShopDomainsSection = () => {
  const { config, isLoading, updateNested, save, isUpdating } = useStoreConfig();
  const [subdomain, setSubdomain] = React.useState("");

  React.useEffect(() => {
    if (config?.hostname) {
      // Assuming hostname is like 'subdomain.maindomain.com' or just 'customdomain.com'
      const parts = config.hostname.split('.');
      if (parts.length > 2) { // Heuristic for subdomain
        setSubdomain(parts[0]);
      }
    }
  }, [config]);

  if (isLoading || !config) {
    return (
      <CollapsibleCard title="Shop Domains">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CollapsibleCard>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  };

  const handleDeleteDomain = () => {
    updateNested('hostname', ''); // Clear the hostname
    save();
    showError("Custom domain removed.");
  };

  const handleSaveSubdomain = () => {
    // This logic assumes a base domain. Let's use 'scalebiz.com' as an example.
    const newHostname = `${subdomain}.scalebiz.com`;
    updateNested('hostname', newHostname);
    save();
  };

  const cnameValue = "myshop.scalebiz.com"; // Updated CNAME value

  return (
    <CollapsibleCard title="Shop Domains">
      <h3 className="text-lg font-semibold mb-2">Your Free Domain</h3>
      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder="myshop"
          className="flex-1"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
        />
        <span className="text-muted-foreground">.scalebiz.com</span>
        <Button onClick={handleSaveSubdomain} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Save Domain'}
        </Button>
      </div>

      <h3 className="text-lg font-semibold mb-2">Your Custom Domain</h3>
      <p className="text-sm text-muted-foreground mb-4">
        To change the domain, delete the existing one and add a new one.
      </p>
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={config.hostname || ''}
          onChange={(e) => updateNested('hostname', e.target.value)}
          placeholder="example.com"
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={() => handleCopy(config.hostname || '')}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={handleDeleteDomain}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-end">
        <Button onClick={save} disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Update Custom Domain'}
        </Button>
      </div>

      {/* New Cloudflare DNS Settings Section */}
      <div className="mt-8 p-4 rounded-md bg-muted/50 border">
        <h3 className="text-lg font-semibold mb-2">Configure DNS Settings in Cloudflare</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ensure you add the following DNS records to your <span className="font-semibold">Cloudflare DNS</span> with the <span className="font-semibold">TTL</span> set to <span className="font-semibold">Auto</span> and the <span className="font-semibold">Proxy Status</span> set to <span className="font-semibold">Proxied</span>. Then, set the <span className="font-semibold">SSL</span> mode to <span className="font-semibold">Flexible</span>. After adding the records, please allow up to 24 hours for your domain to be verified. For any assistance, feel free to contact us.
        </p>
        <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center gap-1 mb-4">
          Full guide line - Click Here <Copy className="h-3 w-3" />
        </a>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">CNAME</TableCell>
                <TableCell className="flex items-center justify-between">
                  <span className="text-purple-600">{cnameValue}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(cnameValue)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ShopDomainsSection;