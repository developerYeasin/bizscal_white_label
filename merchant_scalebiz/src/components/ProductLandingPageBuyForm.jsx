"use client";

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Corrected import
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, MapPin, Menu, Mail, Plus, Minus } from "lucide-react";
import ThemedButton from "./ThemedButton";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { createOrder } from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InputWithLeadingIcon from "./InputWithLeadingIcon";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { DISTRICT_OPTIONS } from "@/data/districts"; // Import shared DISTRICT_OPTIONS
import CustomDropdown from "./CustomDropdown";

const productLandingPageBuySchema = z.object({
  firstName: z.string().min(1, { message: "Name is required." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  district: z.string().min(1, { message: "District is required." }),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')), // Made optional and allows empty string
  orderNote: z.string().optional(),
});

const ProductLandingPageBuyForm = ({ product }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("outside-dhaka");
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { currentCurrency, currencyConversionRate } = useStore();

  const form = useForm({
    resolver: zodResolver(productLandingPageBuySchema),
    defaultValues: {
      firstName: "",
      phone: "",
      address: "",
      district: "",
      email: "",
      orderNote: "",
    },
  });

  const shippingCost = useMemo(() => {
    return selectedShippingMethod === "inside-dhaka" ? 70 : 130;
  }, [selectedShippingMethod]);

  const subtotal = product.price * quantity;
  const total = subtotal + shippingCost;

  const handleApplyCoupon = async () => {
    setCouponMessage({ text: "", type: "" });
    if (!couponCodeInput.trim()) {
      setCouponMessage({ text: t('please_enter_coupon_code'), type: "error" });
      return;
    }
    setIsApplyingCoupon(true);
    const toastId = showLoading(t('applying'));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    dismissToast(toastId);
    setCouponMessage({ text: t('coupon_applied_placeholder', { code: couponCodeInput }), type: "success" });
    setIsApplyingCoupon(false);
  };

  const handlePlaceOrder = async (data) => {
    const toastId = showLoading(t('placing_order'));
    try {
      // Add the product to cart before placing the order
      addToCart(product, quantity);

      const orderItems = [{
        product_id: product.id,
        variant_id: null,
        quantity: quantity,
      }];

      const orderData = {
        customer_email: data.email || "cod_customer@example.com",
        customer_phone: data.phone,
        shipping_address: {
          address: data.address,
          city: data.district,
          state: "N/A",
          zip: "N/A", // Removed postal code
          country: "Bangladesh",
        },
        billing_address: {
          address: data.address,
          city: data.district,
          state: "N/A",
          zip: "N/A", // Removed postal code
          country: "Bangladesh",
        },
        shipping_method: selectedShippingMethod === "inside-dhaka" ? "Inside Dhaka City COD" : "Outside Dhaka City COD",
        payment_method: "Cash On Delivery",
        customer_notes: data.orderNote || "Direct order via landing page form.",
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        tax_amount: 0,
        discount_amount: 0,
        order_items: orderItems,
        customer_ip_address: "127.0.0.1",
        user_agent: navigator.userAgent,
        utm_source: "dyad-app-landing-page",
      };

      const orderResponse = await createOrder(orderData);

      if (orderResponse.status === "success") {
        showSuccess(t('order_placed_successfully'));
        clearCart(); // Clear cart after successful order
        navigate("/order-confirmation");
      } else {
        showError(orderResponse.message || t('failed_to_place_order'));
      }
    } catch (error) {
      console.error("Order placement error:", error);
      showError(t('unexpected_error_placing_order'));
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
        {t('confirm_order_cod_title')}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePlaceOrder)} className="space-y-5">
          {/* Product Info */}
          <div className="flex items-center space-x-4 border-b pb-4 mb-4">
            <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-xl font-bold text-dynamic-primary-color">
                {formatPrice(product.price, currentCurrency, currencyConversionRate)}
              </p>
              <div className="flex items-center mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-8 text-center mx-2 border-0 bg-transparent focus-visible:ring-0"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">{t('your_name')} *</FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon icon={User} placeholder={t('your_name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">{t('phone_number')} *</FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon icon={Phone} placeholder={t('phone_number')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">{t('your_address')} *</FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon icon={MapPin} placeholder={t('your_address')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">{t('district')} *</FormLabel>
                  <FormControl>
                    <CustomDropdown
                      options={DISTRICT_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('select_district')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email field moved to the bottom of personal info */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">{t('email')} <span className="text-muted-foreground">{t('optional')}</span></FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon icon={Mail} placeholder={t('your_email')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Shipping Method */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-bold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('shipping_method')}</h3>
            <RadioGroup onValueChange={setSelectedShippingMethod} value={selectedShippingMethod} className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inside-dhaka" id="shipping-inside" />
                  <Label htmlFor="shipping-inside" className="cursor-pointer text-base">{t('inside_dhaka_city')}</Label>
                </div>
                <span className="font-semibold">Tk 70.00</span>
              </div>
              <div className="flex flex-col p-3 border rounded-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outside-dhaka" id="shipping-outside" />
                      <Label htmlFor="shipping-outside" className="cursor-pointer text-base">{t('outside_dhaka_city')}</Label>
                    </div>
                    <span className="font-semibold">Tk 130.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-7">
                    {t('advance_payment_required')}
                  </p>
                </div>
              </RadioGroup>
            </div>

            {/* Coupon Code */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="text-lg font-bold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('coupon_code')}</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder={t('coupon_code')}
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="flex-grow"
                />
                <ThemedButton onClick={handleApplyCoupon} disabled={isApplyingCoupon} className="bg-green-600 hover:bg-green-700 text-white">
                  {isApplyingCoupon ? t('applying') : t('apply')}
                </ThemedButton>
              </div>
              {couponMessage.text && (
                <p className={`text-sm mt-2 ${couponMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <h3 className="text-lg font-bold" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('your_order')}</h3>
            {/* Directly render the single product */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{quantity}</span>
                </div>
                <p className="font-semibold text-foreground">{product.name}</p>
              </div>
              <p className="font-semibold text-foreground">
                {formatPrice(product.price * quantity, currentCurrency, currencyConversionRate)}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="font-medium">
                  {formatPrice(subtotal, currentCurrency, currencyConversionRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="font-medium">
                  {formatPrice(shippingCost, currentCurrency, currencyConversionRate)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                <span>{t('total')}</span>
                <span>
                  {formatPrice(total, currentCurrency, currencyConversionRate)}
                </span>
              </div>
            </div>
          {/* End of Order Summary content */}

          {/* Order Note */}
          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">{t('order_note')}</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-muted rounded-l-md border border-r-0 border-input text-muted-foreground">
                      <Menu className="h-5 w-5" />
                    </div>
                    <Textarea placeholder={t('order_note')} className="pl-14 min-h-[80px] rounded-l-none border-l-0" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
          )}
          />

          {/* Final Action Buttons */}
          <ThemedButton type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-bold">
            {t('confirm_order_click')}
          </ThemedButton>
          <p className="text-center text-red-600 text-sm font-medium">
            {t('order_confirm_warning')}
          </p>
        </form>
      </Form>
    </div>
  );
};

export default ProductLandingPageBuyForm;