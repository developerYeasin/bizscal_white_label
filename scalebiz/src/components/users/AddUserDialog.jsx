"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { useUsers } from "@/hooks/use-users.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Eye, EyeOff, Plus } from "lucide-react"; // Removed Search, X
import { Badge } from "@/components/ui/badge.jsx"; // Keep Badge for display
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

const AddUserDialog = ({ isOpen, onClose }) => {
  const { inviteUser, isInviting } = useUsers();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("staff"); // Default role
  const [selectedPermissions, setSelectedPermissions] = React.useState([]); // State for selected permissions
  const [showPassword, setShowPassword] = React.useState(false);
  const [isAssignPermissionsDialogOpen, setIsAssignPermissionsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset form fields when dialog closes
      setEmail("");
      setPassword("");
      setRole("staff");
      setSelectedPermissions([]);
      setShowPassword(false);
    }
  }, [isOpen]);

  // Effect to clear permissions if role is owner
  React.useEffect(() => {
    if (role === 'owner') {
      setSelectedPermissions([]); // Owner has all permissions implicitly
    }
  }, [role]);

  const getPermissionLabel = (value) => {
    return allPermissions.find(p => p.value === value)?.label || value;
  };

  const handleAddUser = () => {
    if (!email || !password || !role) {
      showError("Email, Password, and Role are required.");
      return;
    }

    const payload = {
      email,
      password,
      role,
      permissions: role === 'owner' ? allPermissions.map(p => p.value) : selectedPermissions, // Owner gets all permissions
    };

    inviteUser(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] h-[90vh] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Add shop users</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-0 px-4">
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="newuser@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isInviting}
                  required
                />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isInviting}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isInviting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} disabled={isInviting}>
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
              </div>
              <div>
                <Label htmlFor="permissions">Permissions</Label>
                {role === 'owner' ? (
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
                    <Button variant="outline" className="mt-2 w-full" onClick={() => setIsAssignPermissionsDialogOpen(true)} disabled={isInviting}>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Permissions
                    </Button>
                  </>
                )}
              </div>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4 p-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isInviting}>Close</Button>
            <Button onClick={handleAddUser} disabled={isInviting}>
              {isInviting ? "Adding..." : "Add User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AssignPermissionsDialog
        isOpen={isAssignPermissionsDialogOpen}
        onClose={() => setIsAssignPermissionsDialogOpen(false)}
        selectedPermissions={selectedPermissions}
        onSelectPermissions={setSelectedPermissions}
        isDisabled={isInviting}
      />
    </>
  );
};

export default AddUserDialog;