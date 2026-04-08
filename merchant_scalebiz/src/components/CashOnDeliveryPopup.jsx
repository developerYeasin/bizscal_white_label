import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CustomModal from "./CustomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Menu,
  Mail,
  Plus,
  Minus,
} from "lucide-react";
import ThemedButton from "./ThemedButton";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "@/utils/toast";
import { createIncompleteOrder, updateOrder, validateCoupon } from "@/lib/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputWithLeadingIcon from "./InputWithLeadingIcon";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import { useStore } from "@/context/StoreContext";
import { formatPrice, getNumericPriceForGTM, cn } from "@/lib/utils";
import { DIVISION_OPTIONS } from "@/data/divisions"; // New: Import divisions
import { DISTRICT_OPTIONS } from "@/data/districts"; // Updated: Import districts
import { UPAZILA_OPTIONS } from "@/data/upazilas"; // New: Import upazilas
import { DHAKA_ZONE_OPTIONS } from "@/data/dhakaZones"; // New: Import Dhaka zones
import CustomDropdown from "./CustomDropdown";
import { useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const cashOnDeliverySchema = z.object({
  firstName: z.string().min(1, { message: "Name is required." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  division: z.string().min(1, { message: "Division is required." }), // New: Division
  district: z.string().min(1, { message: "District is required." }), // Updated: District
  upazila: z.string().optional(), // New: Upazila, optional for Dhaka City
  dhakaZone: z.string().optional(), // New: Dhaka Zone, optional for non-Dhaka City
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .optional()
    .or(z.literal("")),
  orderNote: z.string().optional(),
});

const CashOnDeliveryPopup = ({
  isOpen,
  onClose,
  initialProduct,
  initialQuantity,
  initialSelectedVariants = [],
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, updateQuantity, clearCart, removeFromCart } = useCart();
  const { currentCurrency, currencyConversionRate, storeConfig } = useStore();
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });
  const [incompleteOrderId, setIncompleteOrderId] = useState(null);

  const incompleteOrderIdRef = useRef(null);
  const isSavingRef = useRef(false);
  const lastSavedDataRef = useRef("");

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("outside-dhaka");

  const [localQuantity, setLocalQuantity] = useState(initialQuantity || 1);
  const [selectedColor, setSelectedColor] = useState(
    initialSelectedVariants.find((v) => v.type === "color")?.value || "",
  );
  const [selectedSize, setSelectedSize] = useState(
    initialSelectedVariants.find((v) => v.type === "size")?.value || "",
  );
  const [selectedImageVariant, setSelectedImageVariant] = useState(
    initialSelectedVariants.find((v) => v.type === "image")?.value || "",
  );

  useEffect(() => {
    if (isOpen && initialProduct) {
      setLocalQuantity(initialQuantity || 1);
      setSelectedColor(
        initialSelectedVariants.find((v) => v.type === "color")?.value || "",
      );
      setSelectedSize(
        initialSelectedVariants.find((v) => v.type === "size")?.value || "",
      );
      setSelectedImageVariant(
        initialSelectedVariants.find((v) => v.type === "image")?.value || "",
      );
    }
  }, [isOpen, initialProduct, initialQuantity, initialSelectedVariants]);

  // Calculate current price for the initial product based on its selected variants
  const initialProductAdjustedPrice = useMemo(() => {
    if (!initialProduct) return 0;
    let price = parseFloat(
      initialProduct.salePrice || initialProduct.price || 0,
    ); // Explicit parseFloat
    const colorOption = initialProduct.colors?.find(
      (c) => c.value === selectedColor,
    );
    if (colorOption && colorOption.extraPrice) price += colorOption.extraPrice;
    const sizeOption = initialProduct.sizes?.find(
      (s) => s.value === selectedSize,
    );
    if (sizeOption && sizeOption.extraPrice) price += sizeOption.extraPrice;
    const imageVariantOption = initialProduct.imageVariants?.find(
      (iv) => iv.value === selectedImageVariant,
    );
    if (imageVariantOption && imageVariantOption.extraPrice)
      price += imageVariantOption.extraPrice; // Fixed typo here
    return price;
  }, [initialProduct, selectedColor, selectedSize, selectedImageVariant]);

  const getSelectedVariantOptionsForInitialProduct = () => {
    const options = [];
    const selectedColorOption = initialProduct?.colors?.find(
      (c) => c.value === selectedColor,
    );
    const selectedSizeOption = initialProduct?.sizes?.find(
      (s) => s.value === selectedSize,
    );
    const selectedImageVariantOption = initialProduct?.imageVariants?.find(
      (iv) => iv.value === selectedImageVariant,
    );

    if (selectedColorOption) {
      options.push({
        type: "color",
        value: selectedColorOption.value,
        label: selectedColorOption.label,
        hex: selectedColorOption.hex,
        extraPrice: selectedColorOption.extraPrice,
      });
    }
    if (selectedSizeOption) {
      options.push({
        type: "size",
        value: selectedSizeOption.value,
        label: selectedSizeOption.label,
        extraPrice: selectedSizeOption.extraPrice,
      });
    }
    if (selectedImageVariantOption) {
      options.push({
        type: "image",
        value: selectedImageVariantOption.value,
        label: selectedImageVariantOption.label,
        imageUrl: selectedImageVariantOption.imageUrl,
        extraPrice: selectedImageVariantOption.extraPrice,
      });
    }
    return options;
  };

  const itemsToDisplay = useMemo(() => {
    const allProducts = [];
    if (initialProduct) {
      // For the initial product, use its current local quantity and selected variants
      allProducts.push({
        ...initialProduct,
        quantity: localQuantity,
        price: initialProductAdjustedPrice, // Use the adjusted price here
        selectedVariantOptions: getSelectedVariantOptionsForInitialProduct(),
      });
    }

    cartItems.forEach((cartItem) => {
      // Only add cart item if it's not the initial product (to avoid duplication)
      if (!initialProduct || cartItem.id !== initialProduct.id) {
        allProducts.push(cartItem);
      }
    });
    return allProducts;
  }, [
    initialProduct,
    localQuantity,
    cartItems,
    selectedColor,
    selectedSize,
    selectedImageVariant,
    initialProductAdjustedPrice,
  ]); // Re-run if variant selection changes

  const subtotal = useMemo(() => {
    return itemsToDisplay.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [itemsToDisplay]);

  const form = useForm({
    resolver: zodResolver(cashOnDeliverySchema),
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
  const debouncedFormValues = useDebounce(form.watch(), 1000); // Debounce form values

  const selectedDivision = form.watch("division");
  const selectedDistrict = form.watch("district");
  const selectedUpazila = form.watch("upazila");
  const selectedDhakaZone = form.watch("dhakaZone");

  const isDhakaCitySelected = selectedDistrict === "Dhaka City";

  // Filter districts based on selected division
  const filteredDistricts = useMemo(() => {
    // if (!selectedDivision || isDhakaCitySelected) return [];
    const division = DIVISION_OPTIONS.find(
      (div) => div.name === selectedDivision,
    );
    if (!division) return [];
    return DISTRICT_OPTIONS.filter(
      (district) => district.division_id === division.id,
    );
  }, [selectedDivision, isDhakaCitySelected]);

  // Filter upazilas based on selected district
  const filteredUpazilas = useMemo(() => {
    // if (!selectedDistrict || isDhakaCitySelected) return [];
    const district = DISTRICT_OPTIONS.find(
      (dist) => dist.name === selectedDistrict,
    );
    if (!district) return [];
    return UPAZILA_OPTIONS.filter(
      (upazila) => upazila.district_id === district.id,
    );
  }, [selectedDistrict, isDhakaCitySelected]);

  // Reset district, upazila, dhakaZone when division changes
  useEffect(() => {
    form.setValue("district", "");
    form.setValue("upazila", "");
    form.setValue("dhakaZone", "");
  }, [selectedDivision, form]);

  // Reset upazila when district changes
  useEffect(() => {
    form.setValue("upazila", "");
  }, [selectedDistrict, form]);

  const calculateShippingCost = useCallback(() => {
    const isDhakaCityAreaSelected = debouncedFormValues.division === "Dhaka" && debouncedFormValues.district === "Dhaka City";

    const freeShippingThreshold = parseFloat(
      storeConfig?.deliverySettings?.buy_amount_to_get_free_delivery || 0,
    );
    if (subtotal >= freeShippingThreshold && freeShippingThreshold > 0) {
      return 0; // Free shipping if threshold is met
    }

    const defaultCharge = parseFloat(
      storeConfig?.deliverySettings?.default_charge || 0,
    );
    let calculatedCost = defaultCharge;

    if (storeConfig?.deliverySettings?.zones) {
      if (isDhakaCitySelected && debouncedFormValues.dhakaZone) {
        const dhakaZoneMatch = DHAKA_ZONE_OPTIONS.find(
          (zone) => zone.name === debouncedFormValues.dhakaZone,
        );
        if (dhakaZoneMatch) {
          const customZone = storeConfig.deliverySettings.zones.find(
            (z) => z.type === "Zones" && z.zone_name === dhakaZoneMatch.name,
          );
          if (customZone) {
            return parseFloat(customZone.charge);
          }
        }
      }

      if (debouncedFormValues.district) {
        const districtMatch = DISTRICT_OPTIONS.find(
          (dist) => dist.name === debouncedFormValues.district,
        );
        if (districtMatch) {
          const customZone = storeConfig.deliverySettings.zones.find(
            (z) => z.type === "Districts" && z.zone_id === districtMatch.id,
          );
          if (customZone) {
            return parseFloat(customZone.charge);
          }
        }
      }

      if (debouncedFormValues.upazila) {
        const upazilaMatch = UPAZILA_OPTIONS.find(
          (upa) => upa.name === debouncedFormValues.upazila,
        );
        if (upazilaMatch) {
          const customZone = storeConfig.deliverySettings.zones.find(
            (z) => z.type === "Upazila/P.S" && z.zone_id === upazilaMatch.id,
          );
          if (customZone) {
            return parseFloat(customZone.charge);
          }
        }
      }
    }

    return calculatedCost;
  }, [
    storeConfig,
    isDhakaCitySelected,
    debouncedFormValues.dhakaZone,
    debouncedFormValues.district,
    debouncedFormValues.upazila,
    subtotal,
  ]);

  const shippingCost = calculateShippingCost();
  const total = subtotal + shippingCost - discountAmount;

  useEffect(() => {
    const handleAutoSave = async () => {
      // Only auto-save if the popup is open and there are items to display
      if (!isOpen || itemsToDisplay.length === 0 || (!debouncedFormValues.firstName && !debouncedFormValues.phone)) return;

      const currentPayload = {
        customer_phone: debouncedFormValues.phone,
        customer_email: debouncedFormValues.email || "customer@example.com",
        shipping_address: {
          address: debouncedFormValues.address,
          city: isDhakaCitySelected
            ? debouncedFormValues.dhakaZone
            : debouncedFormValues.upazila || debouncedFormValues.district,
          state: debouncedFormValues.district,
          country: "Bangladesh",
        },
        order_items: itemsToDisplay.map((item) => ({
          product_id: item.id,
          product_name_at_purchase: item.name,
          quantity: item.quantity,
          price_at_purchase: item.price,
          selected_variants: item.selectedVariantOptions || [],
        })),
        subtotal_amount: parseFloat(subtotal.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        discount_amount: parseFloat(discountAmount.toFixed(2)),
        total_amount: parseFloat(total.toFixed(2)), // Use calculated total
        coupon_code: appliedCoupon?.code || null,
        payment_method: "Cash On Delivery", // Always COD for this popup
        customer_notes: debouncedFormValues.orderNote,
        status: "incomplete",
      };

      const payloadString = JSON.stringify(currentPayload);
      if (payloadString === lastSavedDataRef.current || isSavingRef.current) return;

      isSavingRef.current = true;
      lastSavedDataRef.current = payloadString;

      try {
        let response;
        if (incompleteOrderIdRef.current) {
          response = await updateOrder(incompleteOrderIdRef.current, currentPayload);
        } else {
          response = await createIncompleteOrder(currentPayload);
        }

        if (response?.status === "success" && response.data?.order_id) {
          incompleteOrderIdRef.current = response.data.order_id;
          setIncompleteOrderId(response.data.order_id);
        }
      } catch (error) {
        console.error("CashOnDeliveryPopup Auto-save update failed:", error);
      } finally {
        isSavingRef.current = false;
      }
    };
    handleAutoSave();
  }, [isOpen, debouncedFormValues, itemsToDisplay, subtotal, shippingCost, discountAmount, total, appliedCoupon]);

  const handleApplyCoupon = async () => {
    setCouponMessage({ text: "", type: "" });
    if (!couponCodeInput.trim()) {
      setCouponMessage({ text: t("please_enter_coupon_code"), type: "error" });
      return;
    }
    setIsApplyingCoupon(true);
    const toastId = showLoading(t("applying"));

    try {
      const res = await validateCoupon({ code: couponCodeInput, productIds: itemsToDisplay.map(i => i.id) });
      if (res.success) {
        let disc = res.data.discount_type === "percent" ? (subtotal * parseFloat(res.data.discount_value)) / 100 : parseFloat(res.data.discount_value);
        setAppliedCoupon(res.data);
        setDiscountAmount(Math.min(disc, subtotal));
        dismissToast(toastId);
        showSuccess(t("coupon_applied"));
        setCouponMessage({ text: t("coupon_applied_placeholder", { code: couponCodeInput }), type: "success" });
      } else {
        dismissToast(toastId);
        showError(res.message || t("failed_to_apply_coupon"));
        setCouponMessage({ text: res.message, type: "error" });
      }
    } catch (e) {
      dismissToast(toastId);
      showError(t("error_applying_coupon"));
      setCouponMessage({ text: t("error_applying_coupon"), type: "error" });
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  const handleRemoveItem = (itemId) => {
    if (initialProduct && itemId === initialProduct.id) {
      // If the item being removed is the initial product, close the popup
      onClose();
    } else {
      // Otherwise, remove it from the cart
      removeFromCart(itemId);
    }
  };

  const handlePlaceOrder = async (data) => {
    const toastId = showLoading(t("placing_cod_order"));
    try {
      if (!incompleteOrderIdRef.current) {
        dismissToast(toastId);
        showError(t("order_not_initialized"));
        return;
      }

      const orderItems = itemsToDisplay.map((item) => ({
        product_id: item.id,
        product_name_at_purchase: item.name,
        sku_at_purchase: item.sku,
        selected_variants: item.selectedVariantOptions || [],
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const finalOrderData = {
        customer_email: data.email || "cod_customer@example.com",
        customer_phone: data.phone,
        shipping_address: {
          address: data.address,
          city: isDhakaCitySelected
            ? data.dhakaZone
            : data.upazila || data.district,
          state: data.district,
          country: "Bangladesh",
        },
        billing_address: {
          address: data.address,
          city: isDhakaCitySelected
            ? data.dhakaZone
            : data.upazila || data.district,
          state: data.district,
          country: "Bangladesh",
        },
        shipping_method:
          selectedShippingMethod === "inside-dhaka"
            ? "Inside Dhaka City COD"
            : "Outside Dhaka City COD",
        payment_method: "Cash On Delivery",
        customer_notes:
          data.orderNote || "Direct order via Cash On Delivery popup.",
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        tax_amount: 0,
        discount_amount: parseFloat(discountAmount.toFixed(2)), // Use actual discount
        total_amount: parseFloat(total.toFixed(2)), // Use calculated total
        order_items: orderItems,
        customer_ip_address: "127.0.0.1",
        user_agent: navigator.userAgent,
        utm_source: "dyad-app-cod-popup",
        coupon_code: appliedCoupon?.code || null,
        status: "pending", // Mark as completed for final COD order
        finalize_order: true,
      };

      const orderResponse = await updateOrder(incompleteOrderIdRef.current, finalOrderData);

      if (orderResponse.status === "success") {
        if (window.dataLayer) {
          const gtmItems = itemsToDisplay.map((item) => ({
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
            total,
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
              tax: 0,
              shipping: gtmShipping,
              currency: currentCurrency,
              coupon: appliedCoupon?.code || undefined,
              discount: gtmDiscount,
              items: gtmItems,
            },
          });
          // console.log("GTM: 'purchase' event pushed for COD order:", incompleteOrderIdRef.current);
        }

        showSuccess(t("cod_order_placed_successfully"));
        onClose();
        if (initialProduct) {
          removeFromCart(initialProduct.id);
        } else {
          clearCart();
        }
        navigate(`/order-confirmation`, { state: { orderId: incompleteOrderIdRef.current } });
      } else {
        showError(orderResponse.message || t("failed_to_place_cod_order"));
      }
    } catch (error) {
      console.error("Cash On Delivery order placement error:", error);
      showError(t("unexpected_error_placing_order"));
    } finally {
      dismissToast(toastId);
    }
  };

  if (itemsToDisplay.length === 0) {
    return (
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={t("confirm_order_cod_title")}
        className="sm:max-w-md"
      >
        <div className="text-center mb-6">
          <p className="text-center text-lg text-muted-foreground">
            {t("cart_empty_order")}
          </p>
          <ThemedButton onClick={onClose} className="w-full mt-4">
            {t("continue_shopping_button")}
          </ThemedButton>
        </div>
      </CustomModal>
    );
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("confirm_order_cod_title")}
      className="sm:max-w-lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePlaceOrder)}
          className="space-y-5 p-6"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("your_name")} *
                  </FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon
                      icon={User}
                      placeholder={t("your_name")}
                      {...field}
                    />
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
                  <FormLabel className="text-base font-semibold">
                    {t("phone_number")} *
                  </FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon
                      icon={Phone}
                      placeholder={t("phone_number")}
                      {...field}
                    />
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
                  <FormLabel className="text-base font-semibold">
                    {t("your_address")} *
                  </FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon
                      icon={MapPin}
                      placeholder={t("your_address")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Division Dropdown */}
            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("division")} *
                  </FormLabel>
                  <FormControl>
                    <CustomDropdown
                      options={DIVISION_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("select_division")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional District/Dhaka Zone Dropdown */}
            {selectedDivision && (
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("district")} *
                    </FormLabel>
                    <FormControl>
                      <CustomDropdown
                        options={filteredDistricts}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("select_district")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isDhakaCitySelected && (
              <FormField
                control={form.control}
                name="dhakaZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("zone")} *
                    </FormLabel>
                    <FormControl>
                      <CustomDropdown
                        options={DHAKA_ZONE_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("select_zone")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Conditional Upazila Dropdown */}
            {selectedDistrict && !isDhakaCitySelected && (
              <FormField
                control={form.control}
                name="upazila"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("upazila")} *
                    </FormLabel>
                    <FormControl>
                      <CustomDropdown
                        options={filteredUpazilas}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("select_upazila")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {t("email")}{" "}
                    <span className="text-muted-foreground">
                      {t("optional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <InputWithLeadingIcon
                      icon={Mail}
                      placeholder={t("your_email")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Shipping Method */}
          {/* <div className="space-y-4 pt-4 border-t border-border">
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
          </div> */}

          {/* Coupon Code */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: `var(--dynamic-heading-font)` }}
            >
              {t("coupon_code")}
            </h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder={t("coupon_code")}
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                className="flex-grow"
              />
              <ThemedButton
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isApplyingCoupon ? t("applying") : t("apply")}
              </ThemedButton>
            </div>
            {couponMessage.text && (
              <p
                className={`text-sm mt-2 ${couponMessage.type === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: `var(--dynamic-heading-font)` }}
            >
              {t("your_order")}
            </h3>
            {itemsToDisplay.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between relative"
              >
                {" "}
                {/* Added relative positioning */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute -top-2 -left-2 text-muted-foreground hover:text-destructive p-1 z-10" // Positioned top-left
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-3 ml-4">
                  {" "}
                  {/* Adjusted margin for the button */}
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    {item.selectedVariantOptions &&
                      item.selectedVariantOptions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {item.selectedVariantOptions.map((variant, idx) => (
                            <span key={idx} className="mr-1">
                              {variant.type === "color" &&
                                `${t("color")}: ${variant.label}`}
                              {variant.type === "size" &&
                                `${t("size")}: ${t(variant.label)}`}
                              {variant.type === "image" &&
                                `${t("image_variant")}: ${variant.label}`}
                              {idx < item.selectedVariantOptions.length - 1 &&
                                ", "}
                            </span>
                          ))}
                        </div>
                      )}
                    {item.id === initialProduct?.id ? (
                      <div className="flex items-center mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            setLocalQuantity(Math.max(1, localQuantity - 1))
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={localQuantity}
                          onChange={(e) =>
                            setLocalQuantity(
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          className="w-16 h-8 text-center mx-2 border-0 bg-transparent focus-visible:ring-0"
                          min="1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setLocalQuantity(localQuantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-16 h-8 text-center mx-2 border-0 bg-transparent focus-visible:ring-0"
                          min="1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-foreground">
                  {formatPrice(
                    item.price * item.quantity,
                    currentCurrency,
                    currencyConversionRate,
                  )}
                </p>
              </div>
            ))}
            {initialProduct &&
              (initialProduct.colors?.length > 0 ||
                initialProduct.sizes?.length > 0 ||
                initialProduct.imageVariants?.length > 0) && (
                <div className="space-y-2 mt-4">
                  {/* Color Options for initialProduct */}
                  {initialProduct.colors &&
                    initialProduct.colors.length > 0 && (
                      <div>
                        <Label className="block text-sm font-medium mb-2">
                          {t("color")}:{" "}
                          <span className="font-semibold text-foreground">
                            {initialProduct.colors.find(
                              (c) => c.value === selectedColor,
                            )?.label ||
                              selectedColor ||
                              t("select_color")}
                          </span>
                        </Label>
                        <RadioGroup
                          value={selectedColor}
                          onValueChange={setSelectedColor}
                          className="flex space-x-2"
                        >
                          {initialProduct.colors.map((color) => (
                            <div
                              key={color.value}
                              className="flex items-center"
                            >
                              <RadioGroupItem
                                value={color.value}
                                id={`cod-color-${color.value}`}
                                className={cn(
                                  "h-6 w-6 rounded-full border-2",
                                  selectedColor === color.value
                                    ? "border-dynamic-primary-color"
                                    : "border-border",
                                )}
                                style={{ backgroundColor: color.hex }}
                              />
                              <Label
                                htmlFor={`cod-color-${color.value}`}
                                className="sr-only"
                              >
                                {color.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                  {/* Size Options for initialProduct */}
                  {initialProduct.sizes && initialProduct.sizes.length > 0 && (
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        {t("size")}:{" "}
                        <span className="font-semibold text-foreground">
                          {t(
                            initialProduct.sizes.find(
                              (s) => s.value === selectedSize,
                            )?.label,
                          ) ||
                            t(selectedSize) ||
                            t("select_size")}
                        </span>
                      </Label>
                      <RadioGroup
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                        className="flex flex-wrap gap-2"
                      >
                        {initialProduct.sizes.map((size) => (
                          <div key={size.value}>
                            <RadioGroupItem
                              value={size.value}
                              id={`cod-size-${size.value}`}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`cod-size-${size.value}`}
                              className={cn(
                                "flex items-center justify-center h-9 px-4 rounded-md border-2 cursor-pointer transition-colors",
                                selectedSize === size.value
                                  ? "border-dynamic-primary-color bg-dynamic-primary-color text-dynamic-secondary-color"
                                  : "border-border bg-background text-foreground hover:bg-accent",
                              )}
                            >
                              {t(size.label)}{" "}
                              {size.extraPrice > 0 &&
                                `(+${formatPrice(size.extraPrice, currentCurrency, currencyConversionRate)})`}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Image Variants for initialProduct */}
                  {initialProduct.imageVariants &&
                    initialProduct.imageVariants.length > 0 && (
                      <div>
                        <Label className="block text-sm font-medium mb-2">
                          {t("image_variant")}:{" "}
                          <span className="font-semibold text-foreground">
                            {initialProduct.imageVariants.find(
                              (iv) => iv.value === selectedImageVariant,
                            )?.label ||
                              selectedImageVariant ||
                              t("select_image_variant")}
                          </span>
                        </Label>
                        <RadioGroup
                          value={selectedImageVariant}
                          onValueChange={setSelectedImageVariant}
                          className="flex space-x-2"
                        >
                          {initialProduct.imageVariants.map((variant) => (
                            <div key={variant.value}>
                              <RadioGroupItem
                                value={variant.value}
                                id={`cod-image-variant-${variant.value}`}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={`cod-image-variant-${variant.value}`}
                                className={cn(
                                  "flex items-center justify-center w-16 h-16 rounded-md overflow-hidden border-2 cursor-pointer transition-colors",
                                  selectedImageVariant === variant.value
                                    ? "border-dynamic-primary-color"
                                    : "border-border hover:border-gray-400",
                                )}
                              >
                                <img
                                  src={variant.imageUrl}
                                  alt={variant.label}
                                  className="w-full h-full object-cover"
                                />
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                </div>
              )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-medium">
                  {formatPrice(
                    subtotal,
                    currentCurrency,
                    currencyConversionRate,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span className="font-medium">
                  {formatPrice(
                    shippingCost,
                    currentCurrency,
                    currencyConversionRate,
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>
                    {t("discount")}{appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}
                  </span>
                  <span>
                    -{formatPrice(
                      discountAmount,
                      currentCurrency,
                      currencyConversionRate,
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                <span>{t("total")}</span>
                <span>
                  {formatPrice(total, currentCurrency, currencyConversionRate)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Note */}
          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {t("order_note")}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-muted rounded-l-md border border-r-0 border-input text-muted-foreground">
                      <Menu className="h-5 w-5" />
                    </div>
                    <Textarea
                      placeholder={t("order_note")}
                      className="pl-14 min-h-[80px] rounded-l-none border-l-0"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Final Action Buttons */}
          <ThemedButton
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-bold"
          >
            {t("confirm_order_click")}
          </ThemedButton>
          <p className="text-center text-red-600 text-sm font-medium">
            {t("order_confirm_warning")}
          </p>
        </form>
      </Form>
    </CustomModal>
  );
};

export default CashOnDeliveryPopup;
