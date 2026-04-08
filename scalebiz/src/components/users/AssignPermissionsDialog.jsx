"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Plus, X, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { cn } from "@/lib/utils.js";
import { Input } from "@/components/ui/input.jsx";
import { useDebounce } from "@/hooks/use-debounce.js";
import { showSuccess } from "@/utils/toast.js";

// Define all available permissions
const allPermissions = [
  { value: "read_dashboard", label: "Read Dashboard" },
  { value: "read_orders", label: "Read Orders" },
  { value: "write_orders", label: "Write Orders" },
  { value: "read_products", label: "Read Products" },
  { value: "write_products", label: "Write Products" },
  { value: "read_categories", label: "Read Categories" },
  { value: "write_categories", label: "Write Categories" },
  { value: "read_customers", label: "Read Customers" },
  { value: "manage_shop_settings", label: "Manage Shop Settings" },
  { value: "edit_shop_settings", label: "Edit Shop Settings" },
  { value: "edit_header_settings", label: "Edit Header Settings" },
  { value: "edit_shop_domain", label: "Edit Shop Domain" },
  { value: "edit_shop_policy", label: "Edit Shop Policy" },
  { value: "edit_delivery_settings", label: "Edit Delivery Settings" },
  { value: "edit_payment_settings", label: "Edit Payment Settings" },
  { value: "edit_seo_marketing", label: "Edit SEO & Marketing" },
  { value: "edit_sms_settings", label: "Edit SMS Settings" },
  { value: "edit_chat_settings", label: "Edit Chat Settings" },
  { value: "edit_social_links", label: "Edit Social Links" },
  { value: "edit_footer_settings", label: "Edit Footer Settings" },
  { value: "customize_theme", label: "Customize Theme" },
  { value: "manage_landing_pages", label: "Manage Landing Pages" },
  { value: "read_promo_codes", label: "Read Promo Codes" },
  { value: "write_promo_codes", label: "Write Promo Codes" },
  { value: "manage_users", label: "Manage Users" },
  { value: "access_settings", label: "Access Settings" },
  { value: "read_analytics", label: "Read Analytics" },
  { value: "read_billing", label: "Read Billing" },
  { value: "manage_subscription", label: "Manage Subscription" },
  { value: "access_academy", label: "Access Academy" },
  { value: "access_vendor_dashboard", label: "Access Vendor Dashboard" },
];

const AssignPermissionsDialog = ({ isOpen, onClose, selectedPermissions, onSelectPermissions, isDisabled = false }) => {
  const [tempSelectedPermissions, setTempSelectedPermissions] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedPermissions(selectedPermissions);
    }
  }, [isOpen, selectedPermissions]);

  const filteredPermissions = React.useMemo(() => {
    return allPermissions.filter(permission =>
      permission.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm]);

  const handlePermissionToggle = (permissionValue) => {
    if (isDisabled) return;
    setTempSelectedPermissions(prev =>
      prev.includes(permissionValue)
        ? prev.filter(id => id !== permissionValue)
        : [...prev, permissionValue]
    );
  };

  const handleRemoveSelectedPermission = (permissionValue) => {
    if (isDisabled) return;
    setTempSelectedPermissions(prev => prev.filter(id => id !== permissionValue));
  };

  const handleDone = () => {
    onSelectPermissions(tempSelectedPermissions);
    onClose();
  };

  const isAllFilteredSelected = filteredPermissions.every(permission =>
    tempSelectedPermissions.includes(permission.value)
  );

  const handleSelectAllToggle = () => {
    if (isDisabled) return;
    if (isAllFilteredSelected) {
      const newSelection = tempSelectedPermissions.filter(id =>
        !filteredPermissions.some(permission => permission.value === id)
      );
      setTempSelectedPermissions(newSelection);
    } else {
      const newSelection = [
        ...tempSelectedPermissions,
        ...filteredPermissions.map(permission => permission.value).filter(id => !tempSelectedPermissions.includes(id))
      ];
      setTempSelectedPermissions(newSelection);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Assign Permissions</DialogTitle>
          </div>
        </DialogHeader>
        <div className="relative mb-4 px-4">
          <Input
            type="text"
            placeholder="Search permissions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isDisabled}
          />
          <Search className="absolute left-6 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <ScrollArea className="flex-1 h-0 px-4">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Selected Permissions</h3>
              {filteredPermissions.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleSelectAllToggle} disabled={isDisabled}>
                  {isAllFilteredSelected ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] border rounded-md p-2">
              {tempSelectedPermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No permissions selected.</p>
              ) : (
                tempSelectedPermissions.map(value => {
                  const permission = allPermissions.find(p => p.value === value);
                  return permission ? (
                    <Badge
                      key={value}
                      variant="secondary"
                      className={cn(
                        "bg-purple-100 text-purple-700",
                        !isDisabled && "hover:bg-purple-200 cursor-pointer"
                      )}
                      onClick={() => handleRemoveSelectedPermission(value)}
                    >
                      {permission.label}
                      {!isDisabled && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ) : null;
                })
              )}
            </div>

            <h3 className="text-lg font-semibold mb-2">All Permissions</h3>
            {filteredPermissions.length === 0 ? (
              <p className="text-center text-muted-foreground">No permissions found matching your search.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredPermissions.map(permission => (
                  <Badge
                    key={permission.value}
                    variant={tempSelectedPermissions.includes(permission.value) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      tempSelectedPermissions.includes(permission.value)
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => handlePermissionToggle(permission.value)}
                    disabled={isDisabled}
                  >
                    {permission.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4 p-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isDisabled}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleDone} disabled={isDisabled}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPermissionsDialog;