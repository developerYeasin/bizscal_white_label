"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext.jsx";
import { useStore } from "@/context/StoreContext.jsx";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ThemedButton from "@/components/ThemedButton.jsx";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "@/utils/toast";
import CustomModal from "@/components/CustomModal";
import {
  validateCoupon,
  createIncompleteOrder,
  updateOrder,
  fetchCategories,
  fetchCourierStatus,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Plus, Minus, User, Phone, MapPin, X } from "lucide-react";
import { formatPrice, getNumericPriceForGTM } from "@/lib/utils";
import InputWithLeadingIcon from "@/components/InputWithLeadingIcon";
import { DIVISION_OPTIONS } from "@/data/divisions";
import { DISTRICT_OPTIONS } from "@/data/districts";
import { UPAZILA_OPTIONS } from "@/data/upazilas";
import { DHAKA_ZONE_OPTIONS } from "@/data/dhakaZones";
import CustomDropdown from "@/components/CustomDropdown";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import BkashPayment from "@/components/payment/BkashPayment";
import i18next from "i18next";

const checkoutSchema = z.object({
  firstName: z.string().min(1, { message: "Name is required." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  division: z.string().min(1, { message: "Division is required." }),
  district: z.string().min(1, { message: "District is required." }),
  upazila: z.string().optional(),
  dhakaZone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  orderNote: z.string().optional(),
});

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const { storeConfig, currentCurrency, currencyConversionRate } = useStore();
  const navigate = useNavigate();
  const getPath = useStorePath();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [fraudModalContent, setFraudModalContent] = useState({
    title: "",
    description: "",
  });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [incompleteOrderId, setIncompleteOrderId] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  const incompleteOrderIdRef = useRef(null);
  const isSavingRef = useRef(false);
  const lastSavedDataRef = useRef("");

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      phone: "",
      address: "",
      division: "",
      district: "",
      upazila: "",
      dhakaZone: "",
      email: "",
      orderNote: "",
    },
  });

  const formValues = form.watch();
  const debouncedFormValues = useDebounce(formValues, 1000);

  const isDhakaCityAreaSelected =
    debouncedFormValues.division === "Dhaka" &&
    debouncedFormValues.district === "Dhaka City";

  // Financial Calculations
  const finalTotal = useMemo(() => {
    return cartTotal + shippingCost - discountAmount;
  }, [cartTotal, shippingCost, discountAmount]);

  useEffect(() => {
    if (!storeConfig) return;
    const zones = storeConfig?.deliverySettings?.zones || [];
    const match = zones.find(
      (z) =>
        z.zone_name === debouncedFormValues.district ||
        z.zone_name === debouncedFormValues.upazila,
    );
    setShippingCost(
      match
        ? parseFloat(match.charge)
        : parseFloat(storeConfig?.deliverySettings?.default_charge || 0),
    );
  }, [debouncedFormValues.district, debouncedFormValues.upazila, storeConfig]);

  // GTM: begin_checkout event
  useEffect(() => {
    if (cartItems.length > 0 && window.dataLayer) {
      const gtmItems = cartItems.map((item) => ({
        item_id: item.sku || item.id.toString(),
        item_name: item.name,
        currency: currentCurrency,
        price: getNumericPriceForGTM(
          item.price,
          currentCurrency,
          currencyConversionRate,
        ),
        quantity: item.quantity,
        item_category: item.category || "N/A",
        item_brand: item.brand || "N/A",
      }));
      const gtmValue = getNumericPriceForGTM(
        cartTotal,
        currentCurrency,
        currencyConversionRate,
      );

      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: currentCurrency,
          value: gtmValue,
          items: gtmItems,
        },
      });
      // console.log("GTM: 'begin_checkout' event pushed.");
    }
  }, [cartItems, currentCurrency, currencyConversionRate, cartTotal]);

  // --- UPDATED AUTO-SAVE LOGIC ---
  useEffect(() => {
    const handleAutoSave = async () => {
      if (
        cartItems.length === 0 ||
        (!debouncedFormValues.firstName && !debouncedFormValues.phone)
      )
        return;

      const currentPayload = {
        customer_phone: debouncedFormValues.phone,
        customer_email: debouncedFormValues.email || "customer@example.com",
        shipping_address: {
          address: debouncedFormValues.address,
          city: isDhakaCityAreaSelected
            ? debouncedFormValues.dhakaZone
            : debouncedFormValues.upazila || debouncedFormValues.district,
          state: debouncedFormValues.district,
          country: "Bangladesh",
        },
        order_items: cartItems.map((item) => ({
          product_id: item.id,
          product_name_at_purchase: item.name,
          quantity: item.quantity,
          price_at_purchase: item.price,
          selected_variants: item.selectedVariantOptions || [],
        })),
        // Comprehensive money-related info
        subtotal_amount: parseFloat(cartTotal.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        discount_amount: parseFloat(discountAmount.toFixed(2)),
        total_amount: parseFloat(finalTotal.toFixed(2)),
        coupon_code: appliedCoupon?.code || null,
        payment_method: selectedPaymentMethod || "Pending",
        customer_notes: debouncedFormValues.orderNote,
        status: "incomplete",
      };

      const payloadString = JSON.stringify(currentPayload);
      if (payloadString === lastSavedDataRef.current || isSavingRef.current)
        return;

      isSavingRef.current = true;
      lastSavedDataRef.current = payloadString;

      try {
        let response;
        if (incompleteOrderIdRef.current) {
          response = await updateOrder(
            incompleteOrderIdRef.current,
            currentPayload,
          );
        } else {
          response = await createIncompleteOrder(currentPayload);
        }

        if (response?.status === "success" && response.data?.order_id) {
          incompleteOrderIdRef.current = response.data.order_id;
          setIncompleteOrderId(response.data.order_id);
        }
      } catch (error) {
        console.error("Auto-save update failed:", error);
      } finally {
        isSavingRef.current = false;
      }
    };
    handleAutoSave();
  }, [
    debouncedFormValues,
    cartItems,
    shippingCost,
    discountAmount,
    finalTotal,
    appliedCoupon,
    selectedPaymentMethod,
    isDhakaCityAreaSelected,
  ]);

  const filteredDistricts = useMemo(() => {
    const div = DIVISION_OPTIONS.find((d) => d.name === formValues.division);
    return div ? DISTRICT_OPTIONS.filter((d) => d.division_id === div.id) : [];
  }, [formValues.division]);

  const filteredUpazilas = useMemo(() => {
    if (isDhakaCityAreaSelected) return [];
    const dist = DISTRICT_OPTIONS.find((d) => d.name === formValues.district);
    return dist ? UPAZILA_OPTIONS.filter((u) => u.district_id === dist.id) : [];
  }, [formValues.district, isDhakaCityAreaSelected]);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const res = await validateCoupon({
        code: couponCodeInput,
        productIds: cartItems.map((i) => i.id),
      });
      if (res.success) {
        let disc =
          res.data.discount_type === "percent"
            ? (cartTotal * parseFloat(res.data.discount_value)) / 100
            : parseFloat(res.data.discount_value);
        setAppliedCoupon(res.data);
        setDiscountAmount(Math.min(disc, cartTotal));
        setCouponMessage({ text: t("coupon_applied"), type: "success" });
      } else {
        setCouponMessage({ text: res.message, type: "error" });
      }
    } catch (e) {
      showError(t("error_applying_coupon"));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPaymentMethod)
      return showError(t("please_select_payment_method"));
    setIsPlacingOrder(true);
    const tid = showLoading(t("placing_order"));
    try {
      const { fraudPrevention } = storeConfig;

      if (fraudPrevention?.enabled) {
        const customerPhoneNumber = data.phone;
        const minSuccessRate = fraudPrevention.customer_order_success_rate;

        if (customerPhoneNumber) {
          const courierStatusResponse =
            await fetchCourierStatus(customerPhoneNumber);

          if (
            courierStatusResponse.status === "success" &&
            courierStatusResponse.courierData?.summary?.success_ratio !==
              undefined
          ) {
            const successRatio =
              courierStatusResponse.courierData.summary.success_ratio;
            console.log("Fraud prevention success ratio:", successRatio);
            console.log("Fraud prevention min success ratio:", minSuccessRate);
            console.log(
              "successRatio < minSuccessRate: ",
              successRatio < minSuccessRate,
            );
            if (successRatio < minSuccessRate) {
              dismissToast(tid);
              const currentLang = i18next.language;
              const modalTitle =
                currentLang === "bn"
                  ? fraudPrevention.bangla_title
                  : fraudPrevention.english_title;
              const modalDescription =
                currentLang === "bn"
                  ? fraudPrevention.bangla_description
                  : fraudPrevention.english_description;

              setFraudModalContent({
                title: modalTitle,
                description: modalDescription,
              });
              setIsFraudModalOpen(true);
              setIsPlacingOrder(false);
              return; // Prevent order placement
            }
          } else {
            console.warn(
              "Failed to fetch courier status or invalid response for fraud prevention.",
              courierStatusResponse,
            );
            // Optionally, decide whether to prevent order or proceed if courier status check fails
            // For now, we'll proceed but log a warning.
          }
        } else {
          console.warn(
            "Customer phone number missing for fraud prevention check.",
          );
          // Decide if an order should be prevented if phone number is missing for the check.
        }
      }

      const finalData = {
        ...data,
        status:
          selectedPaymentMethod === "Cash On Delivery"
            ? "completed"
            : "pending_payment",
        payment_method: selectedPaymentMethod,
        total_amount: finalTotal,
        discount_amount: discountAmount,
        shipping_cost: shippingCost,
        coupon_code: appliedCoupon?.code || null,
        finalize_order: true,
      };
      const res = await updateOrder(incompleteOrderIdRef.current, finalData);
      if (res.status === "success") {
        const taxAmount = 0; // Assuming tax is 0 for now, adjust if tax is implemented
        if (window.dataLayer) {
          const gtmItems = cartItems.map((item) => ({
            item_id: item.sku || item.id.toString(),
            item_name: item.name,
            currency: currentCurrency,
            price: getNumericPriceForGTM(
              item.price,
              currentCurrency,
              currencyConversionRate,
            ),
            quantity: item.quantity,
            item_category: item.category || "N/A",
            item_brand: item.brand || "N/A",
          }));
          const gtmValue = getNumericPriceForGTM(
            finalTotal,
            currentCurrency,
            currencyConversionRate,
          );
          const gtmTax = getNumericPriceForGTM(
            taxAmount,
            currentCurrency,
            currencyConversionRate,
          );
          const gtmShipping = getNumericPriceForGTM(
            shippingCost,
            currentCurrency,
            currencyConversionRate,
          );
          const gtmDiscount = getNumericPriceForGTM(
            discountAmount,
            currentCurrency,
            currencyConversionRate,
          );

          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id: incompleteOrderIdRef.current.toString(),
              value: gtmValue,
              tax: gtmTax,
              shipping: gtmShipping,
              currency: currentCurrency,
              coupon: appliedCoupon?.code || undefined,
              items: gtmItems,
            },
          });
          // console.log("GTM: 'purchase' event pushed for order:", incompleteOrderIdRef.current);
        }
        clearCart();
        navigate(getPath("/order-confirmation"), {
          state: { orderId: incompleteOrderIdRef.current },
        });
      }
    } catch (e) {
      showError("Submission failed");
    } finally {
      dismissToast(tid);
      setIsPlacingOrder(false);
    }
  };

  if (!storeConfig) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header
        layout={storeConfig.layout}
        storeName={storeConfig.storeConfiguration.storeName}
        logoUrl={storeConfig.storeConfiguration.logoUrl}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Order Summary */}
          <div className="lg:col-start-2">
            <div className="bg-card p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24 border">
              <h2 className="text-2xl font-bold mb-6">{t("order_summary")}</h2>
              <div className="space-y-4 max-h-[450px] overflow-y-auto pt-4 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex  justify-between items-start relative border-b pb-4"
                  >
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute -top-1 -left-1 bg-background rounded-full border p-1 z-10 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="flex items-start space-x-4 ml-4">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm truncate max-w-[150px]">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(
                            item.price,
                            currentCurrency,
                            currencyConversionRate,
                          )}
                        </p>
                        <div className="flex items-center mt-2 bg-muted/50 rounded-full border p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-xs">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="font-bold text-sm">
                      {formatPrice(
                        item.price * item.quantity,
                        currentCurrency,
                        currencyConversionRate,
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{t("subtotal")}</span>
                  <span>
                    {formatPrice(
                      cartTotal,
                      currentCurrency,
                      currencyConversionRate,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("shipping")}</span>
                  <span>
                    {shippingCost === 0
                      ? t("free")
                      : formatPrice(
                          shippingCost,
                          currentCurrency,
                          currencyConversionRate,
                        )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>
                      {t("discount")} ({appliedCoupon?.code})
                    </span>
                    <span>
                      -
                      {formatPrice(
                        discountAmount,
                        currentCurrency,
                        currencyConversionRate,
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
                  <span>{t("total")}</span>
                  <span className="text-primary">
                    {formatPrice(
                      finalTotal,
                      currentCurrency,
                      currencyConversionRate,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">
                {t("shipping_information")}
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("your_name")} *</FormLabel>
                        <FormControl>
                          <InputWithLeadingIcon icon={User} {...field} />
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
                        <FormLabel>{t("phone_number")} *</FormLabel>
                        <FormControl>
                          <InputWithLeadingIcon icon={Phone} {...field} />
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
                        <FormLabel>{t("your_address")} *</FormLabel>
                        <FormControl>
                          <InputWithLeadingIcon icon={MapPin} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("division")} *</FormLabel>
                          <CustomDropdown
                            options={DIVISION_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("select")}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("district")} *</FormLabel>
                          <CustomDropdown
                            options={filteredDistricts}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("select")}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isDhakaCityAreaSelected ? (
                    <FormField
                      control={form.control}
                      name="dhakaZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("zone")} *</FormLabel>
                          <CustomDropdown
                            options={DHAKA_ZONE_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("select_zone")}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="upazila"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("upazila")} *</FormLabel>
                          <CustomDropdown
                            options={filteredUpazilas}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("select_upazila")}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="orderNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("order_note")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("order_note")} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-bold mb-4">
                      {t("payment_method")}
                    </h3>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                      className="space-y-3"
                    >
                      {storeConfig.paymentSettings?.cod_enabled && (
                        <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-accent/50">
                          <RadioGroupItem value="Cash On Delivery" id="cod" />
                          <Label
                            htmlFor="cod"
                            className="flex-grow cursor-pointer"
                          >
                            {t("cash_on_delivery")}
                          </Label>
                        </div>
                      )}
                      {storeConfig.paymentSettings?.bkash_enabled && (
                        <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-accent/50">
                          <RadioGroupItem value="bKash" id="bkash" />
                          <Label
                            htmlFor="bkash"
                            className="flex-grow cursor-pointer"
                          >
                            bKash (Online)
                          </Label>
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder={t("coupon_code")}
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                      >
                        {t("apply")}
                      </Button>
                    </div>
                  </div>

                  {selectedPaymentMethod === "Cash On Delivery" ? (
                    <ThemedButton
                      type="submit"
                      className="w-full h-12 text-lg"
                      disabled={isPlacingOrder || cartItems.length === 0}
                    >
                      {isPlacingOrder ? t("processing") : t("confirm_order")}
                    </ThemedButton>
                  ) : (
                    <div className="space-y-3">
                      {selectedPaymentMethod === "bKash" && (
                        <BkashPayment
                          amount={finalTotal}
                          orderId={incompleteOrderId}
                          customerInfo={form.getValues()}
                          onPaymentSuccess={(id) => {
                            const taxAmount = 0; // Assuming tax is 0 for now, adjust if tax is implemented
                            if (window.dataLayer) {
                              const gtmItems = cartItems.map((item) => ({
                                item_id: item.sku || item.id.toString(),
                                item_name: item.name,
                                currency: currentCurrency,
                                price: getNumericPriceForGTM(
                                  item.price,
                                  currentCurrency,
                                  currencyConversionRate,
                                ),
                                quantity: item.quantity,
                                item_category: item.category || "N/A",
                                item_brand: item.brand || "N/A",
                              }));
                              const gtmValue = getNumericPriceForGTM(
                                finalTotal,
                                currentCurrency,
                                currencyConversionRate,
                              );
                              const gtmTax = getNumericPriceForGTM(
                                taxAmount,
                                currentCurrency,
                                currencyConversionRate,
                              );
                              const gtmShipping = getNumericPriceForGTM(
                                shippingCost,
                                currentCurrency,
                                currencyConversionRate,
                              );
                              const gtmDiscount = getNumericPriceForGTM(
                                discountAmount,
                                currentCurrency,
                                currencyConversionRate,
                              );

                              window.dataLayer.push({ ecommerce: null });
                              window.dataLayer.push({
                                event: "purchase",
                                ecommerce: {
                                  transaction_id: id.toString(), // Use the id from onPaymentSuccess
                                  value: gtmValue,
                                  tax: gtmTax,
                                  shipping: gtmShipping,
                                  currency: currentCurrency,
                                  coupon: appliedCoupon?.code || undefined,
                                  items: gtmItems,
                                },
                              });
                              // console.log("GTM: 'purchase' event pushed for order:", id);
                            }
                            clearCart();
                            navigate(getPath("/order-confirmation"), {
                              state: { orderId: id },
                            });
                          }}
                        />
                      )}
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <CustomModal
        isOpen={isFraudModalOpen}
        onClose={() => setIsFraudModalOpen(false)}
        title={fraudModalContent.title}
      >
        <div className="p-4">
          <p
            dangerouslySetInnerHTML={{ __html: fraudModalContent.description }}
          />
        </div>
      </CustomModal>
      <Footer
        layout={storeConfig?.layout?.footer || {}}
        copyrightText={storeConfig?.layout?.footer?.copyrightText || ""}
        socialLinks={storeConfig?.layout?.footer?.socialLinks || []}
        logoUrl={storeConfig?.storeConfiguration?.logoUrl || ""}
        storeName={storeConfig?.storeConfiguration?.storeName || ""}
      />
    </div>
  );
};

export default Checkout;
