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
import { Switch } from "@/components/ui/switch.jsx";
import { Calendar as CalendarIcon, Info, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.jsx";
import { useCoupons } from "@/hooks/use-coupons.js";
import { useProducts } from "@/hooks/use-products.js";
import { useCategories } from "@/hooks/use-categories.js";
import AssignCategoriesDialog from "@/components/categories/AssignCategoriesDialog.jsx";
import AssignProductsDialog from "@/components/promo-codes/AssignProductsDialog.jsx"; // New import

const CreatePromoCodeDialog = ({ isOpen, onClose, initialData }) => {
  const { createCoupon, updateCoupon, isCreating, isUpdating } = useCoupons();
  const { products, isLoading: productsLoading } = useProducts(); // Keep for displaying selected product names
  const { categories, isLoading: categoriesLoading } = useCategories(); // Keep for displaying selected category names

  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState("percent"); // 'percent' or 'amount'
  const [discountValue, setDiscountValue] = React.useState("");
  const [minimumSpend, setMinimumSpend] = React.useState("");
  const [usageLimitPerCoupon, setUsageLimitPerCoupon] = React.useState("");
  const [usageLimitPerCustomer, setUsageLimitPerCustomer] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [validFrom, setValidFrom] = React.useState();
  const [validUntil, setValidUntil] = React.useState();
  const [selectedProductIds, setSelectedProductIds] = React.useState([]); // Changed to IDs array
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState([]); // Changed to IDs array

  const [isAssignProductsDialogOpen, setIsAssignProductsDialogOpen] = React.useState(false);
  const [isAssignCategoriesDialogOpen, setIsAssignCategoriesDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCode(initialData.code || "");
        setDiscountType(initialData.discount_type || "percent");
        setDiscountValue(String(initialData.discount_value || ""));
        setMinimumSpend(String(initialData.minimum_spend || ""));
        setUsageLimitPerCoupon(String(initialData.usage_limit_per_coupon || ""));
        setUsageLimitPerCustomer(String(initialData.usage_limit_per_customer || ""));
        setIsActive(initialData.is_active === 1);
        setValidFrom(initialData.valid_from ? parseISO(initialData.valid_from) : undefined);
        setValidUntil(initialData.valid_until ? parseISO(initialData.valid_until) : undefined);
        setSelectedProductIds(initialData.applies_to_products?.map(String) || []); // Ensure string IDs
        setSelectedCategoryIds(initialData.applies_to_categories?.map(String) || []); // Ensure string IDs
      } else {
        // Reset form for new coupon
        setCode("");
        setDiscountType("percent");
        setDiscountValue("");
        setMinimumSpend("");
        setUsageLimitPerCoupon("");
        setUsageLimitPerCustomer("");
        setIsActive(true);
        setValidFrom(undefined);
        setValidUntil(undefined);
        setSelectedProductIds([]);
        setSelectedCategoryIds([]);
      }
    }
  }, [isOpen, initialData]);

  // Memoize product and category names for display
  const selectedProductNames = React.useMemo(() => {
    if (!products || selectedProductIds.length === 0) return [];
    return selectedProductIds.map(id => products.find(p => String(p.id) === id)?.name).filter(Boolean);
  }, [products, selectedProductIds]);

  const selectedCategoryNames = React.useMemo(() => {
    if (!categories || selectedCategoryIds.length === 0) return [];
    return selectedCategoryIds.map(id => categories.find(c => String(c.id) === id)?.name).filter(Boolean);
  }, [categories, selectedCategoryIds]);

  const handleSavePromoCode = () => {
    if (!code || !discountValue) {
      showError("Code Name and Discount Value are required.");
      return;
    }

    const payload = {
      code,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      minimum_spend: minimumSpend ? parseFloat(minimumSpend) : 0,
      usage_limit_per_coupon: usageLimitPerCoupon ? parseInt(usageLimitPerCoupon) : null,
      usage_limit_per_customer: usageLimitPerCustomer ? parseInt(usageLimitPerCustomer) : null,
      is_active: isActive ? 1 : 0,
      valid_from: validFrom ? format(validFrom, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null,
      valid_until: validUntil ? format(validUntil, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") : null,
      applies_to_products: selectedProductIds.map(Number), // Convert back to numbers for API
      applies_to_categories: selectedCategoryIds.map(Number), // Convert back to numbers for API
    };

    if (initialData) {
      updateCoupon({ id: initialData.id, ...payload }, {
        onSuccess: onClose,
      });
    } else {
      createCoupon(payload, {
        onSuccess: onClose,
      });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[600px] h-[90vh] max-h-[90vh] flex flex-col overflow-visible"
          onPointerDownOutside={(e) => {
            // Prevent dialog from closing when clicking on popover content (like calendar)
            const target = e.target;
            if (target.closest('.radix-themes-popper') || target.closest('.rdp')) { // Check for Radix popover or react-day-picker
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{initialData ? "Edit Promo Code" : "Create Promo Code"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-0">
            <div className="grid gap-4 py-4 px-4">
              <div>
                <Label htmlFor="codeName">Code Name <span className="text-destructive">*</span></Label>
                <Input
                  id="codeName"
                  placeholder="Promo Code"
                  className="mt-1"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isSaving}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a unique promo code.
                </p>
              </div>

              <div className="mb-2">
                <Label>Discount Type</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    variant={discountType === "amount" ? "default" : "outline"}
                    onClick={() => setDiscountType("amount")}
                    className={cn(
                      discountType === "amount"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    disabled={isSaving}
                  >
                    Amount
                  </Button>
                  <Button
                    variant={discountType === "percent" ? "default" : "outline"}
                    onClick={() => setDiscountType("percent")}
                    className={cn(
                      discountType === "percent"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    disabled={isSaving}
                  >
                    Percentage
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="discountValue">Discount Value <span className="text-destructive">*</span></Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={discountType === "percent" ? "e.g., 10 (for 10%)" : "e.g., 50 (for 50 BDT)"}
                  className="mt-1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <Label htmlFor="minimumSpend">Minimum Spend</Label>
                <Input
                  id="minimumSpend"
                  type="number"
                  placeholder="e.g., 100"
                  className="mt-1"
                  value={minimumSpend}
                  onChange={(e) => setMinimumSpend(e.target.value)}
                  disabled={isSaving}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum amount customer must spend to use this coupon.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimitPerCoupon">Usage Limit Per Coupon</Label>
                  <Input
                    id="usageLimitPerCoupon"
                    type="number"
                    placeholder="e.g., 50"
                    className="mt-1"
                    value={usageLimitPerCoupon}
                    onChange={(e) => setUsageLimitPerCoupon(e.target.value)}
                    disabled={isSaving}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    How many times this coupon can be used in total.
                  </p>
                </div>
                <div>
                  <Label htmlFor="usageLimitPerCustomer">Usage Limit Per Customer</Label>
                  <Input
                    id="usageLimitPerCustomer"
                    type="number"
                    placeholder="e.g., 1"
                    className="mt-1"
                    value={usageLimitPerCustomer}
                    onChange={(e) => setUsageLimitPerCustomer(e.target.value)}
                    disabled={isSaving}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    How many times a single customer can use this coupon.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="text-sm">
                  Is Active?
                </Label>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !validFrom && "text-muted-foreground"
                        )}
                        disabled={isSaving}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validFrom ? format(validFrom, "dd/MM/yyyy") : "dd/MM/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={validFrom}
                        onSelect={setValidFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !validUntil && "text-muted-foreground"
                        )}
                        disabled={isSaving}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validUntil ? format(validUntil, "dd/MM/yyyy") : "dd/MM/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={validUntil}
                        onSelect={setValidUntil}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Assign Products Section */}
              <div>
                <Label>Applies to Products</Label>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] border rounded-md p-2">
                  {selectedProductNames.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No products selected.</p>
                  ) : (
                    selectedProductNames.map((name, index) => (
                      <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {name}
                      </span>
                    ))
                  )}
                </div>
                <Button variant="outline" className="mt-2 w-full" onClick={() => setIsAssignProductsDialogOpen(true)} disabled={isSaving}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Products
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to apply to all products.
                </p>
              </div>

              {/* Assign Categories Section */}
              <div>
                <Label>Applies to Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] border rounded-md p-2">
                  {selectedCategoryNames.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No categories selected.</p>
                  ) : (
                    selectedCategoryNames.map((name, index) => (
                      <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {name}
                      </span>
                    ))
                  )}
                </div>
                <Button variant="outline" className="mt-2 w-full" onClick={() => setIsAssignCategoriesDialogOpen(true)} disabled={isSaving}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Categories
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to apply to all categories.
                </p>
              </div>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4 p-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSavePromoCode} disabled={isSaving}>
              {isSaving ? (initialData ? "Saving..." : "Creating...") : (initialData ? "Save Changes" : "Create Promo Code")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Products Dialog */}
      <AssignProductsDialog
        isOpen={isAssignProductsDialogOpen}
        onClose={() => setIsAssignProductsDialogOpen(false)}
        selectedProductIds={selectedProductIds}
        onSelectProducts={setSelectedProductIds}
      />

      {/* Assign Categories Dialog */}
      <AssignCategoriesDialog
        isOpen={isAssignCategoriesDialogOpen}
        onClose={() => setIsAssignCategoriesDialogOpen(false)}
        selectedCategoryIds={selectedCategoryIds}
        onSelectCategories={setSelectedCategoryIds}
      />
    </>
  );
};

export default CreatePromoCodeDialog;