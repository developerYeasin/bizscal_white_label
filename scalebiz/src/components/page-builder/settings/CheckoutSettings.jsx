"use client";

import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * CheckoutSettings - Settings component for checkout page blocks
 */
const CheckoutSettings = ({ component, index, updateNested, isUpdating }) => {
  const { data = {} } = component;

  const handleUpdate = (path, value) => {
    updateNested(path, value);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Checkout Settings</h3>
        
        {/* Checkout Title */}
        <div className="space-y-2">
          <Label htmlFor="checkoutTitle">Checkout Title</Label>
          <Input
            id="checkoutTitle"
            value={data.checkoutTitle || "Checkout"}
            onChange={(e) => handleUpdate("checkoutTitle", e.target.value)}
            placeholder="Checkout title"
          />
        </div>

        {/* Show Order Summary */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showOrderSummary">Show Order Summary</Label>
          <Switch
            id="showOrderSummary"
            checked={data.showOrderSummary !== false}
            onCheckedChange={(checked) => handleUpdate("showOrderSummary", checked)}
          />
        </div>

        {/* Show Coupon Code */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showCouponCode">Show Coupon Code</Label>
          <Switch
            id="showCouponCode"
            checked={data.showCouponCode !== false}
            onCheckedChange={(checked) => handleUpdate("showCouponCode", checked)}
          />
        </div>

        {/* Show Payment Methods */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showPaymentMethods">Show Payment Methods</Label>
          <Switch
            id="showPaymentMethods"
            checked={data.showPaymentMethods !== false}
            onCheckedChange={(checked) => handleUpdate("showPaymentMethods", checked)}
          />
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethods">Payment Methods</Label>
          <Select
            value={data.paymentMethods || "bkash,nagad,rocket"}
            onValueChange={(value) => handleUpdate("paymentMethods", value)}
          >
            <SelectTrigger id="paymentMethods">
              <SelectValue placeholder="Select payment methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bkash,nagad,rocket">Bkash, Nagad, Rocket</SelectItem>
              <SelectItem value="bkash">Bkash Only</SelectItem>
              <SelectItem value="nagad">Nagad Only</SelectItem>
              <SelectItem value="rocket">Rocket Only</SelectItem>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
              <SelectItem value="all">All Methods</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Place Order Button */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showPlaceOrder">Show Place Order Button</Label>
          <Switch
            id="showPlaceOrder"
            checked={data.showPlaceOrder !== false}
            onCheckedChange={(checked) => handleUpdate("showPlaceOrder", checked)}
          />
        </div>

        {/* Place Order Button Text */}
        <div className="space-y-2">
          <Label htmlFor="placeOrderButtonText">Place Order Button Text</Label>
          <Input
            id="placeOrderButtonText"
            value={data.placeOrderButtonText || "Place Order"}
            onChange={(e) => handleUpdate("placeOrderButtonText", e.target.value)}
            placeholder="Place order button text"
          />
        </div>

        {/* Show Order Note */}
        <div className="flex items-center justify-between">
          <Label htmlFor="showOrderNote">Show Order Note</Label>
          <Switch
            id="showOrderNote"
            checked={data.showOrderNote !== false}
            onCheckedChange={(checked) => handleUpdate("showOrderNote", checked)}
          />
        </div>

        {/* Show Customer Fields */}
        <div className="space-y-2">
          <Label htmlFor="customerFields">Customer Fields</Label>
          <Select
            value={data.customerFields || "all"}
            onValueChange={(value) => handleUpdate("customerFields", value)}
          >
            <SelectTrigger id="customerFields">
              <SelectValue placeholder="Select customer fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields (Name, Phone, Email, Address)</SelectItem>
              <SelectItem value="minimal">Minimal (Name, Phone)</SelectItem>
              <SelectItem value="extended">Extended (Name, Phone, Email, Address, City, District)</SelectItem>
            </SelectContent>
          </Select>
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

export default CheckoutSettings;
