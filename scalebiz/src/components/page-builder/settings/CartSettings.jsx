"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * CartSettings - Settings component for cart page blocks
 */
const CartSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Cart Settings</h3>
        
        {/* Cart Title */}
        <div className="space-y-2">
          <Label htmlFor="cartTitle">Cart Title</Label>
          <Input
            id="cartTitle"
            value={data.cartTitle || "Shopping Cart"}
            onChange={(e) => handleUpdate("cartTitle", e.target.value)}
            placeholder="Cart title"
          />
        </div>

        {/* Empty Cart Message */}
        <div className="space-y-2">
          <Label htmlFor="emptyCartMessage">Empty Cart Message</Label>
          <Input
            id="emptyCartMessage"
            value={data.emptyCartMessage || "Your cart is empty"}
            onChange={(e) => handleUpdate("emptyCartMessage", e.target.value)}
            placeholder="Empty cart message"
          />
        </div>

        {/* Continue Shopping Link */}
        <div className="space-y-2">
          <Label htmlFor="continueShoppingLink">Continue Shopping Link</Label>
          <Input
            id="continueShoppingLink"
            value={data.continueShoppingLink || "/collections/all"}
            onChange={(e) => handleUpdate("continueShoppingLink", e.target.value)}
            placeholder="Continue shopping link"
          />
        </div>

        {/* Continue Shopping Text */}
        <div className="space-y-2">
          <Label htmlFor="continueShoppingText">Continue Shopping Text</Label>
          <Input
            id="continueShoppingText"
            value={data.continueShoppingText || "Continue Shopping"}
            onChange={(e) => handleUpdate("continueShoppingText", e.target.value)}
            placeholder="Continue shopping text"
          />
        </div>

        {/* Show Quantity Input */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showQuantityInput">Show Quantity Input</Label>
          <Switch
            id="showQuantityInput"
            checked={data.showQuantityInput !== false}
            onCheckedChange={(checked) => handleUpdate("showQuantityInput", checked)}
          />
        </div>

        {/* Show Remove Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showRemoveButton">Show Remove Button</Label>
          <Switch
            id="showRemoveButton"
            checked={data.showRemoveButton !== false}
            onCheckedChange={(checked) => handleUpdate("showRemoveButton", checked)}
          />
        </div>

        {/* Show Subtotal */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showSubtotal">Show Subtotal</Label>
          <Switch
            id="showSubtotal"
            checked={data.showSubtotal !== false}
            onCheckedChange={(checked) => handleUpdate("showSubtotal", checked)}
          />
        </div>

        {/* Show Shipping */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showShipping">Show Shipping</Label>
          <Switch
            id="showShipping"
            checked={data.showShipping !== false}
            onCheckedChange={(checked) => handleUpdate("showShipping", checked)}
          />
        </div>

        {/* Show Total */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showTotal">Show Total</Label>
          <Switch
            id="showTotal"
            checked={data.showTotal !== false}
            onCheckedChange={(checked) => handleUpdate("showTotal", checked)}
          />
        </div>

        {/* Checkout Button Text */}
        <div className="space-y-2">
          <Label htmlFor="checkoutButtonText">Checkout Button Text</Label>
          <Input
            id="checkoutButtonText"
            value={data.checkoutButtonText || "Proceed to Checkout"}
            onChange={(e) => handleUpdate("checkoutButtonText", e.target.value)}
            placeholder="Checkout button text"
          />
        </div>

        {/* Checkout Button Link */}
        <div className="space-y-2">
          <Label htmlFor="checkoutButtonLink">Checkout Button Link</Label>
          <Input
            id="checkoutButtonLink"
            value={data.checkoutButtonLink || "/checkout"}
            onChange={(e) => handleUpdate("checkoutButtonLink", e.target.value)}
            placeholder="Checkout button link"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Display Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            value={data.backgroundColor || "#ffffff"}
            onChange={(e) => handleUpdate("backgroundColor", e.target.value)}
            className="h-10 w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paddingTop">Top Padding (px)</Label>
          <Input
            type="number"
            id="paddingTop"
            value={data.paddingTop || 40}
            onChange={(e) => handleUpdate("paddingTop", parseInt(e.target.value) || 40)}
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paddingBottom">Bottom Padding (px)</Label>
          <Input
            type="number"
            id="paddingBottom"
            value={data.paddingBottom || 40}
            onChange={(e) => handleUpdate("paddingBottom", parseInt(e.target.value) || 40)}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};

export default CartSettings;
