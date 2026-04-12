"use client";

import React from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Plus, Trash2 } from "lucide-react";

const NewsletterCouponBannerSettings = ({
  component,
  index,
  updateNested,
  isUpdating,
}) => {
  const { data = {} } = component;
  const coupons = data.coupons || [];

  const addCoupon = () => {
    const newCoupons = [...coupons, { code: "", discount: "", description: "" }];
    updateNested("data.coupons", newCoupons);
  };

  const removeCoupon = (index) => {
    const newCoupons = coupons.filter((_, i) => i !== index);
    updateNested("data.coupons", newCoupons);
  };

  const updateCoupon = (index, field, value) => {
    const newCoupons = [...coupons];
    newCoupons[index] = { ...newCoupons[index], [field]: value };
    updateNested("data.coupons", newCoupons);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-800">Newsletter Coupon Banner Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Banner Title</Label>
        <Input
          id="title"
          value={data.title || ""}
          onChange={(e) => updateNested("data.title", e.target.value)}
          placeholder="Enter banner title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={data.description || ""}
          onChange={(e) => updateNested("data.description", e.target.value)}
          placeholder="Enter description..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={data.backgroundColor || "#1C2434"}
          onChange={(e) => updateNested("data.backgroundColor", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Text Color</Label>
        <Input
          id="textColor"
          type="color"
          value={data.textColor || "#ffffff"}
          onChange={(e) => updateNested("data.textColor", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Coupons</Label>
        <div className="space-y-3">
          {coupons.map((coupon, index) => (
            <div key={index} className="border rounded-md p-3 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeCoupon(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              
              <div className="space-y-1">
                <Label className="text-xs">Coupon Code</Label>
                <Input
                  value={coupon.code || ""}
                  onChange={(e) => updateCoupon(index, "code", e.target.value)}
                  placeholder="Enter coupon code"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Discount</Label>
                <Input
                  value={coupon.discount || ""}
                  onChange={(e) => updateCoupon(index, "discount", e.target.value)}
                  placeholder="e.g., 10% OFF"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Input
                  value={coupon.description || ""}
                  onChange={(e) => updateCoupon(index, "description", e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
          ))}
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={addCoupon} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" /> Add Coupon
        </Button>
      </div>
    </div>
  );
};

export default NewsletterCouponBannerSettings;
