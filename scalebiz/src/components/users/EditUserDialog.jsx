"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { useUserById, useUsers } from "@/hooks/use-users.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Badge } from "@/components/ui/badge.jsx"; // Keep Badge for display
import { Plus } from "lucide-react"; // Removed Search, X
import AssignPermissionsDialog from "./AssignPermissionsDialog.jsx"; // New import

// Define all available permissions (needed for displaying labels of selected permissions)
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

const EditUserDialog = ({ isOpen, onClose, userId }) => {
  const { data: userData, isLoading, error } = useUserById(userId);
  const { updateUser, isUpdating } = useUsers();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState([]); // State for selected permissions
  const [isAssignPermissionsDialogOpen, setIsAssignPermissionsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setRole(userData.role || "");
      setSelectedPermissions(userData.permissions || []);
    }
  }, [isOpen, userData]);

  // Effect to clear permissions if role is owner
  React.useEffect(() => {
    if (role === 'owner') {
      setSelectedPermissions([]); // Owner has all permissions implicitly
    }
  }, [role]);

  const getPermissionLabel = (value) => {
    return allPermissions.find(p => p.value === value)?.label || value;
  };

  const handleSave = () => {
    if (!name || !email || !role) {
      showError("Name, Email, and Role are required.");
      return;
    }

    const payload = {
      id: userId,
      name,
      email,
      role,
      permissions: role === 'owner' ? allPermissions.map(p => p.value) : selectedPermissions, // Owner gets all permissions
    };

    updateUser(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isOwner = userData?.role === 'owner';
  const isDisabled = isUpdating || isOwner;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] h-[90vh] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit the details and permissions for {userData?.name || "this user"}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 h-0 px-4">
            {isLoading ? (
              <p className="text-center py-4">Loading user data...</p>
            ) : error ? (
              <p className="text-center py-4 text-destructive">Error: {error.message}</p>
            ) : (
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole} disabled={isDisabled}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent> {/* Removed z-index */}
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  {isOwner && <p className="text-xs text-muted-foreground mt-1">Owner role cannot be changed.</p>}
                </div>
                <div>
                  <Label htmlFor="permissions">Permissions</Label>
                  {isOwner ? (
                    <p className="text-sm text-muted-foreground mt-1">Owner has all permissions implicitly.</p>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] border rounded-md p-2">
                        {selectedPermissions.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No permissions selected.</p>
                        ) : (
                          selectedPermissions.map(value => (
                            <Badge
                              key={value}
                              variant="secondary"
                              className="bg-purple-100 text-purple-700"
                            >
                              {getPermissionLabel(value)}
                            </Badge>
                          ))
                        )}
                      </div>
                      <Button variant="outline" className="mt-2 w-full" onClick={() => setIsAssignPermissionsDialogOpen(true)} disabled={isDisabled}>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Permissions
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <DialogFooter className="p-4 pt-0">
            <Button variant="outline" onClick={onClose} disabled={isDisabled}>Cancel</Button>
            <Button onClick={handleSave} disabled={isDisabled}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AssignPermissionsDialog
        isOpen={isAssignPermissionsDialogOpen}
        onClose={() => setIsAssignPermissionsDialogOpen(false)}
        selectedPermissions={selectedPermissions}
        onSelectPermissions={setSelectedPermissions}
        isDisabled={isDisabled}
      />
    </>
  );
};

export default EditUserDialog;