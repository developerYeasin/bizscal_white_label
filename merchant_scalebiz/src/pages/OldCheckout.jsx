// "use client";

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useForm } from "react-hook-form"; // Corrected import
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "@/context/CartContext.jsx";
// import { useStore } from "@/context/StoreContext.jsx";
// import { Header } from "@/components/Header";
// import { Footer } from "@/components/Footer";
// import ThemedButton from "@/components/ThemedButton.jsx";
// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
// import { validateCoupon, createOrder, fetchCategories, createIncompleteOrder, updateOrder, fetchCourierStatus } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
// import { useTranslation } from "react-i18next";
// import { useStorePath } from "@/hooks/use-store-path";
// import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce
// import { Button } from "@/components/ui/button";
// import { Plus, Minus, User, Phone, MapPin, Mail, X, Menu } from "lucide-react"; // Added Menu icon
// import { formatPrice, getNumericPriceForGTM } from "@/lib/utils";
// import InputWithLeadingIcon from "@/components/InputWithLeadingIcon";
// import { DIVISION_OPTIONS } from "@/data/divisions"; // New: Import divisions
// import { DISTRICT_OPTIONS } from "@/data/districts"; // Updated: Import districts
// import { UPAZILA_OPTIONS } from "@/data/upazilas"; // New: Import upazilas
// import { DHAKA_ZONE_OPTIONS } from "@/data/dhakaZones"; // New: Import Dhaka zones
// import CustomDropdown from "@/components/CustomDropdown";
// import { useCallback } from "react";
// import { Textarea } from "@/components/ui/textarea"; // Import Textarea
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup components
// import { Label } from "@/components/ui/label"; // Import Label

// // Payment components
// import BkashPayment from "@/components/payment/BkashPayment";
// import NagadPayment from "@/components/payment/NagadPayment";
// import SslCommerzPayment from "@/components/payment/SslCommerzPayment";

// const checkoutSchema = z.object({
//   firstName: z.string().min(1, { message: "Name is required." }),
//   phone: z.string().min(1, { message: "Phone number is required." }),
//   address: z.string().min(1, { message: "Address is required." }),
//   division: z.string().min(1, { message: "Division is required." }),
//   district: z.string().min(1, { message: "District is required." }),
//   upazila: z.string().optional(),
//   dhakaZone: z.string().optional(),
//   email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
//   orderNote: z.string().optional(), // Added orderNote field
// }).superRefine((data, ctx) => {
//   const selectedDivisionObj = DIVISION_OPTIONS.find(div => div.name === data.division);
//   const selectedDistrictObj = DISTRICT_OPTIONS.find(dist => dist.name === data.district);

//   const isDhakaDivision = selectedDivisionObj?.name === "Dhaka";
//   const isDhakaCityDistrict = selectedDistrictObj?.name === "Dhaka City";

//   if (isDhakaDivision && isDhakaCityDistrict) {
//     if (!data.dhakaZone) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Dhaka Zone is required for Dhaka City.",
//         path: ["dhakaZone"],
//       });
//     }
//   } else if (data.district && !isDhakaCityDistrict) { // If a district is selected and it's not Dhaka City
//     if (!data.upazila) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Upazila is required.",
//         path: ["upazila"],
//       });
//     }
//   }
// });

// const buildCategoryMaps = (categories) => {
//   const categoryIdToParents = new Map();
//   const categorySlugToId = new Map();

//   const traverse = (cats, parentIds = []) => {
//     cats.forEach(cat => {
//       if (cat && cat.id !== undefined && cat.slug !== undefined) {
//         const catId = Number(cat.id);
//         if (isNaN(catId)) {
//           console.warn(`[buildCategoryMaps] Skipping category due to invalid ID:`, cat);
//           return;
//         }

//         categorySlugToId.set(cat.slug, catId);
//         categoryIdToParents.set(catId, parentIds);

//         if (cat.subCategories && cat.subCategories.length > 0) {
//           traverse(cat.subCategories, [...parentIds, catId]);
//         }
//       } else {
//         console.warn(`[buildCategoryMaps] Skipping malformed category:`, cat);
//       }
//     });
//   };
//   traverse(categories);
//   return { categoryIdToParents, categorySlugToId };
// };

// const Checkout = () => {
//   const { t } = useTranslation();
//   const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart(); // Added removeFromCart
//   const { storeConfig, currentCurrency, currencyConversionRate } = useStore();
//   const navigate = useNavigate();
//   const getPath = useStorePath();

//   const [couponCodeInput, setCouponCodeInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // State for selected payment method
//   const [incompleteOrderId, setIncompleteOrderId] = useState(null); // State to store temporary order ID for incomplete orders
//   const incompleteOrderIdRef = useRef(null); // Ref to hold the latest incompleteOrderId
//   const [shippingCost, setShippingCost] = useState(0); // Initialize shippingCost as a state variable

//   // Effect to keep the ref in sync with the state
//   useEffect(() => {
//     incompleteOrderIdRef.current = incompleteOrderId;
//   }, [incompleteOrderId]);

//   const form = useForm({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: {
//       firstName: "",
//       phone: "",
//       address: "",
//       division: "",
//       district: "",
//       upazila: "",
//       dhakaZone: "",
//       email: "",
//       orderNote: "", // Added default value for orderNote
//     },
//   });

//   const selectedDivision = form.watch("division");
//   const selectedDistrict = form.watch("district");
//   const selectedUpazila = form.watch("upazila");
//   const selectedDhakaZone = form.watch("dhakaZone");

//   const isDhakaDivisionSelected = selectedDivision === "Dhaka";
//   const isDhakaCityDistrictSelected = selectedDistrict === "Dhaka City";
//   const isDhakaCityAreaSelected = isDhakaDivisionSelected && isDhakaCityDistrictSelected;

//   // Watch all form values for changes to trigger incomplete order save
//   const formValues = form.watch();
//   const debouncedFormValues = useDebounce(formValues, 1000); // Debounce for 1 second

//   // Define calculateShippingCost before its first use
//   const calculateShippingCost = useCallback(() => {
//     const freeShippingThreshold = parseFloat(storeConfig?.deliverySettings?.buy_amount_to_get_free_delivery || 0);
//     if (cartTotal >= freeShippingThreshold && freeShippingThreshold > 0) {
//       return 0; // Free shipping if threshold is met
//     }

//     const defaultCharge = parseFloat(storeConfig?.deliverySettings?.default_charge || 0);
//     let calculatedCost = defaultCharge;

//     if (storeConfig?.deliverySettings?.zones) {
//       // Prioritize Dhaka City zones
//       // if (selectedDhakaZone) {
//       //   const dhakaZoneMatch = storeConfig.deliverySettings.zones.find(
//       //     (zone) => zone.zone_name === selectedDhakaZone
//       //   );
//       //   if (dhakaZoneMatch) {
//       //     return parseFloat(dhakaZoneMatch.charge);
//       //   }
//       // }

//       // Then check for District-based zones
//       if (selectedDistrict) {
//         const districtMatch = storeConfig.deliverySettings.zones.find(
//           (zone) => zone.zone_name === selectedDistrict
//         );
//         if (districtMatch) {
//           return parseFloat(districtMatch.charge);
//         }
//       }

//       // Finally, check for Upazila-based zones
//       if (selectedUpazila) {
//         const upazilaMatch = storeConfig.deliverySettings.zones.find(
//           (zone) => zone.zone_name === selectedUpazila
//         );
//         if (upazilaMatch) {
//           return parseFloat(customZone.charge);
//         }
//       }
//     }

//     return calculatedCost;
//   }, [storeConfig, isDhakaCityAreaSelected, selectedDhakaZone, selectedDistrict, selectedUpazila, cartTotal]);

//   useEffect(() => {
//     setShippingCost(calculateShippingCost());
//   }, [calculateShippingCost]);

//   const saveIncompleteOrder = useCallback(async () => {
//     const customerInfo = {
//       firstName: debouncedFormValues.firstName,
//       phone: debouncedFormValues.phone,
//       address: debouncedFormValues.address,
//       division: debouncedFormValues.division,
//       district: debouncedFormValues.district,
//       upazila: debouncedFormValues.upazila,
//       dhakaZone: debouncedFormValues.dhakaZone,
//       email: debouncedFormValues.email || "checkout_customer@example.com",
//       orderNote: debouncedFormValues.orderNote || "",
//       city: isDhakaCityAreaSelected ? debouncedFormValues.dhakaZone : debouncedFormValues.upazila || debouncedFormValues.district,
//       state: debouncedFormValues.district,
//       zip: "N/A",
//       country: "Bangladesh",
//     };

//     const orderItems = cartItems.map(item => ({
//       product_id: item.id,
//       product_name_at_purchase: item.name,
//       sku_at_purchase: item.sku,
//       selected_variants: item.selectedVariantOptions || [],
//       quantity: item.quantity,
//       price_at_purchase: item.price,
//     }));

//     let incompleteOrderData = {
//       customer_email: customerInfo.email || "", // Ensure email is not undefined
//       customer_phone: customerInfo.phone || "", // Ensure phone is not undefined
//       shipping_address: {
//         address: customerInfo.address,
//         city: customerInfo.city,
//         state: customerInfo.state,
//         zip: customerInfo.zip,
//         country: customerInfo.country,
//       },
//       billing_address: {
//         address: customerInfo.address,
//         city: customerInfo.city,
//         state: customerInfo.state,
//         zip: customerInfo.zip,
//         country: customerInfo.country,
//       },
//       shipping_method: "Standard Shipping", // Default
//       payment_method: selectedPaymentMethod || "N/A", // Can be updated later
//       customer_notes: customerInfo.orderNote,
//       shipping_cost: parseFloat(shippingCost.toFixed(2)),
//       tax_amount: 0, // Placeholder, tax calculation is complex and might not be needed for incomplete orders
//       discount_amount: parseFloat(discountAmount.toFixed(2)),
//       order_items: orderItems,
//       customer_ip_address: "127.0.0.1", // Placeholder
//       user_agent: navigator.userAgent,
//       utm_source: "dyad-app", // Placeholder
//       status: "incomplete", // Indicate incomplete status
//     };

//     if (appliedCoupon) {
//       incompleteOrderData.coupon_code = appliedCoupon.code;
//     }

//     // If an incomplete order already exists, include its ID for update
//     if (incompleteOrderIdRef.current) {
//       incompleteOrderData.order_id = incompleteOrderIdRef.current;
//     }

//     // Only proceed with saving if either email or phone is provided
//     if (customerInfo.email || customerInfo.phone) {
//       try {
//         let response;
//         if (incompleteOrderIdRef.current) {
//           // If incompleteOrderId exists, update the existing incomplete order
//           response = await updateOrder(incompleteOrderIdRef.current, incompleteOrderData);
//         } else {
//           // Otherwise, create a new incomplete order
//           response = await createIncompleteOrder(incompleteOrderData);
//         }

//         if (response.status === "success" && response.data?.order_id) {
//           setIncompleteOrderId(response.data.order_id); // Store or update the incomplete order ID
//           // console.log("Incomplete order saved/updated:", response.data.order_id);
//         } else {
//           console.error("Failed to save incomplete order:", response.message);
//         }
//       } catch (error) {
//         console.error("Error saving incomplete order:", error);
//       }
//     } else {
//       // console.log("Skipping incomplete order save: Missing customer email and phone.");
//     }
//   }, [debouncedFormValues, cartItems, selectedPaymentMethod, discountAmount, shippingCost, appliedCoupon, isDhakaCityAreaSelected, setIncompleteOrderId, createIncompleteOrder, updateOrder, t]); // Removed incompleteOrderId from dependencies

//   useEffect(() => {
//     // Only attempt to save if form values have changed and cart is not empty, and essential customer info is present
//     if (cartItems.length > 0 &&
//         (debouncedFormValues.firstName ||
//          debouncedFormValues.phone ||
//          debouncedFormValues.address)) {
//       saveIncompleteOrder();
//     }
//   }, [debouncedFormValues, cartItems, saveIncompleteOrder]);

//   // Filter districts based on selected division
//   const filteredDistricts = useMemo(() => {
//     if (!selectedDivision) return [];
//     const division = DIVISION_OPTIONS.find(div => div.name === selectedDivision);
//     if (!division) return [];
//     return DISTRICT_OPTIONS.filter(district => district.division_id === division.id);
//   }, [selectedDivision]);

//   // Filter upazilas based on selected district
//   const filteredUpazilas = useMemo(() => {
//     if (!selectedDistrict || isDhakaCityAreaSelected) return [];
//     const district = DISTRICT_OPTIONS.find(dist => dist.name === selectedDistrict);
//     if (!district) return [];
//     return UPAZILA_OPTIONS.filter(upazila => upazila.district_id === district.id);
//   }, [selectedDistrict, isDhakaCityAreaSelected]);

//   // Memoize delivery settings and zones to prevent unnecessary re-renders
//   const memoizedDeliverySettings = useMemo(() => storeConfig?.deliverySettings || {}, [storeConfig?.deliverySettings]);
//   const memoizedDeliveryZones = useMemo(() => memoizedDeliverySettings?.zones?.filter(zone => zone.type === "Zones") || [], [memoizedDeliverySettings?.zones]);

//   // Fetch all categories dynamically for coupon validation
//   const { data: allCategories, isLoading: isLoadingCategories } = useQuery({
//     queryKey: ['allCategoriesForCoupon'],
//     queryFn: fetchCategories,
//     staleTime: 1000 * 60 * 60,
//   });

//   // Set initial payment method if available and enabled
//   useEffect(() => {
//     if (storeConfig?.paymentSettings) {
//       const { cod_enabled, mfs_enabled, bkash_enabled, aamarpay_enabled, bizscale_enabled } = storeConfig.paymentSettings;
//       if (cod_enabled) setSelectedPaymentMethod("Cash On Delivery");
//       else if (mfs_enabled) setSelectedPaymentMethod(storeConfig.paymentSettings.mfs_method || "MFS");
//       else if (bkash_enabled) setSelectedPaymentMethod("bKash");
//       else if (aamarpay_enabled) setSelectedPaymentMethod("Aamarpay");
//       else if (bizscale_enabled) setSelectedPaymentMethod("Bizscale");
//     }
//   }, [storeConfig?.paymentSettings]);

//   // Reset district, upazila, dhakaZone when division changes
//   useEffect(() => {
//     form.setValue("district", "");
//     form.setValue("upazila", "");
//     form.setValue("dhakaZone", "");
//   }, [selectedDivision, form]);

//   // Reset upazila when district changes
//   useEffect(() => {
//     form.setValue("upazila", "");
//   }, [selectedDistrict, form]);

//   // GTM: begin_checkout event
//   useEffect(() => {
//     if (cartItems.length > 0 && window.dataLayer) {
//       const gtmItems = cartItems.map(item => ({
//         item_id: item.sku || item.id.toString(),
//         item_name: item.name,
//         currency: currentCurrency,
//         price: getNumericPriceForGTM(item.price, currentCurrency, currencyConversionRate),
//         quantity: item.quantity,
//         item_category: item.category || 'N/A',
//         item_brand: item.brand || 'N/A'
//       }));
//       const gtmValue = getNumericPriceForGTM(cartTotal, currentCurrency, currencyConversionRate);

//       window.dataLayer.push({ ecommerce: null });
//       window.dataLayer.push({
//         event: 'begin_checkout',
//         ecommerce: {
//           currency: currentCurrency,
//           value: gtmValue,
//           items: gtmItems
//         }
//       });
//       // console.log("GTM: 'begin_checkout' event pushed.");
//     }
//   }, [cartItems, currentCurrency, currencyConversionRate]);

//   const handleApplyCoupon = async () => {
//     setCouponMessage({ text: "", type: "" });
//     if (!couponCodeInput.trim()) {
//       setAppliedCoupon(null);
//       setDiscountAmount(0);
//       setCouponMessage({ text: t('please_enter_coupon_code'), type: "error" });
//       return;
//     }

//     if (isLoadingCategories) {
//       setCouponMessage({ text: t('categories_loading_try_again'), type: "error" });
//       return;
//     }

//     setIsApplyingCoupon(true);
//     const toastId = showLoading(t('applying_coupon'));
//     try {
//       const productIdsInCart = cartItems.map(item => item.id);

//       const { categoryIdToParents } = allCategories ? buildCategoryMaps(allCategories) : { categoryIdToParents: new Map() };

//       const allRelevantCategoryIds = new Set();

//       cartItems.forEach(item => {
//         if (Array.isArray(item.categoryIds)) {
//           item.categoryIds.forEach(directCategoryId => {
//             const numericCategoryId = Number(directCategoryId);
//             if (isNaN(numericCategoryId) || numericCategoryId === null || numericCategoryId === undefined) {
//               console.warn(`[handleApplyCoupon] Skipping invalid direct category ID:`, directCategoryId, "for product:", item.id);
//               return;
//             }

//             allRelevantCategoryIds.add(numericCategoryId);
//             const parents = categoryIdToParents.get(numericCategoryId);
//             if (parents) {
//               parents.forEach(parentId => allRelevantCategoryIds.add(parentId));
//             }
//           });
//         } else {
//           console.warn(`[handleApplyCoupon] Product ${item.id} has no 'categoryIds' array or it's malformed:`, item.categoryIds);
//         }
//       });

//       const categoryIdsForPayload = Array.from(allRelevantCategoryIds);

//       const validationResponse = await validateCoupon({
//         code: couponCodeInput,
//         productIds: productIdsInCart,
//         categoryIds: categoryIdsForPayload
//       });

//       if (validationResponse.success) {
//         const couponData = validationResponse.data;
//         let calculatedDiscount = 0;

//         if (couponData.discount_type === "percent") {
//           calculatedDiscount = (cartTotal * parseFloat(couponData.discount_value)) / 100;
//         } else if (couponData.discount_type === "fixed_cart") {
//           calculatedDiscount = parseFloat(couponData.discount_value);
//         }
//         calculatedDiscount = Math.min(calculatedDiscount, cartTotal);

//         setAppliedCoupon(couponData);
//         setDiscountAmount(calculatedDiscount);
//         setCouponMessage({ text: t('coupon_applied', { code: couponCodeInput, discount: calculatedDiscount.toFixed(2) }), type: "success" });
//       } else {
//         setAppliedCoupon(null);
//         setDiscountAmount(0);
//         setCouponMessage({ text: validationResponse.message || t('failed_to_apply_coupon'), type: "error" });
//       }
//     } catch (error) {
//       console.error("Coupon application error:", error);
//       setAppliedCoupon(null);
//       setDiscountAmount(0);
//       setCouponMessage({ text: t('error_applying_coupon'), type: "error" });
//     } finally {
//       dismissToast(toastId);
//       setIsApplyingCoupon(false);
//     }
//   };

//   const handlePaymentSuccess = (orderId) => {
//     showSuccess(t('order_placed_successfully'));
//     clearCart();
//     setIncompleteOrderId(null); // Clear incomplete order ID
//     navigate(getPath("/order-confirmation"), { state: { orderId: orderId } });
//   };

//   const handlePaymentFailure = () => {
//     // Optionally, navigate back to checkout or show a specific error page
//     showError(t('payment_failed_please_try_again'));
//     setIsPlacingOrder(false); // Reset loading state
//     setIncompleteOrderId(null); // Clear incomplete order ID
//   };

//   const onSubmit = async (data) => {
//     if (!selectedPaymentMethod) {
//       showError(t('please_select_payment_method'));
//       return;
//     }

//     if (!incompleteOrderId) {
//       showError("Incomplete order ID is missing. Please try again.");
//       setIsPlacingOrder(false);
//       dismissToast(toastId); // Dismiss loading toast immediately if order ID is missing
//       return;
//     }

//     setIsPlacingOrder(true);
//     const toastId = showLoading(t('preparing_order'));

//     try {
//       const { fraudPrevention } = storeConfig;

//       if (fraudPrevention?.enabled) {
//         const customerPhoneNumber = data.phone; // Assuming phone is the customer's contact for courier status
//         const minSuccessRate = fraudPrevention.customer_order_success_rate;

//         if (customerPhoneNumber) {
//           const courierStatusResponse = await fetchCourierStatus(customerPhoneNumber);

//           if (courierStatusResponse.status === "success" && courierStatusResponse.courierData?.summary?.success_ratio !== undefined) {
//             const successRatio = courierStatusResponse.courierData.summary.success_ratio;
//             if (successRatio < minSuccessRate) {
//               dismissToast(toastId);
//               showError(t('order_prevented_low_success_ratio', { rate: minSuccessRate }));
//               setIsPlacingOrder(false);
//               return; // Prevent order placement
//             }
//           } else {
//             console.warn("Failed to fetch courier status or invalid response for fraud prevention.", courierStatusResponse);
//             // Optionally, decide whether to prevent order or proceed if courier status check fails
//             // For now, we'll proceed but log a warning.
//           }
//         } else {
//           console.warn("Customer phone number missing for fraud prevention check.");
//           // Decide if an order should be prevented if phone number is missing for the check.
//         }
//       }

//       const orderItems = cartItems.map(item => ({
//         product_id: item.id,
//         product_name_at_purchase: item.name,
//         sku_at_purchase: item.sku,
//         selected_variants: item.selectedVariantOptions || [], // Use stored variants
//         quantity: item.quantity,
//         price_at_purchase: item.price,
//       }));

//       const taxRate = 0.05;
//       const subtotalAfterDiscount = cartTotal - discountAmount;
//       const taxAmount = subtotalAfterDiscount > 0 ? subtotalAfterDiscount * taxRate : 0;
//       const finalTotal = cartTotal - discountAmount + shippingCost + taxAmount;

//       const customerInfo = {
//         firstName: data.firstName,
//         phone: data.phone,
//         address: data.address,
//         division: data.division,
//         district: data.district,
//         upazila: data.upazila,
//         dhakaZone: data.dhakaZone,
//         email: data.email || "checkout_customer@example.com",
//         orderNote: data.orderNote || "",
//         city: isDhakaCityAreaSelected ? data.dhakaZone : data.upazila || data.district,
//         state: data.district,
//         zip: "N/A",
//         country: "Bangladesh",
//       };

//       const baseOrderData = {
//         customer_email: customerInfo.email,
//         customer_phone: customerInfo.phone,
//         shipping_address: {
//           address: customerInfo.address,
//           city: customerInfo.city,
//           state: customerInfo.state,
//           zip: customerInfo.zip,
//           country: customerInfo.country,
//         },
//         billing_address: {
//           address: customerInfo.address,
//           city: customerInfo.city,
//           state: customerInfo.state,
//           zip: customerInfo.zip,
//           country: customerInfo.country,
//         },
//         shipping_method: "Standard Shipping",
//         payment_method: selectedPaymentMethod,
//         customer_notes: customerInfo.orderNote,
//         shipping_cost: parseFloat(shippingCost.toFixed(2)),
//         tax_amount: parseFloat(taxAmount.toFixed(2)),
//         discount_amount: parseFloat(discountAmount.toFixed(2)),
//         order_items: orderItems,
//         customer_ip_address: "127.0.0.1",
//         user_agent: navigator.userAgent,
//         utm_source: "dyad-app",
//         coupon_code: appliedCoupon?.code || undefined,
//         total_amount: finalTotal, // Pass total amount for payment gateway
//       };

//       // For online payments, we update the incomplete order to pending_payment
//       if (selectedPaymentMethod !== "Cash On Delivery") {
//         const orderResponse = await updateOrder(incompleteOrderId, {
//           ...baseOrderData,
//           status: "pending_payment", // Set status to pending
//         });

//         if (orderResponse.status === "success" && orderResponse.data?.order_id) {
//           dismissToast(toastId); // Dismiss "preparing order" toast
//           showSuccess(t('pending_order_created_proceed_payment'));
//           setIsPlacingOrder(false); // Reset loading state for the form
//         } else {
//           handlePaymentFailure();
//           showError(orderResponse.message || t('failed_to_create_pending_order'));
//         }
//       } else { // Cash On Delivery
//         const orderResponse = await updateOrder(incompleteOrderId, {
//           ...baseOrderData,
//           status: "completed", // For COD, mark as completed directly
//         });

//         if (orderResponse.status === "success") {
//           if (window.dataLayer) {
//             const gtmItems = cartItems.map(item => ({
//               item_id: item.sku || item.id.toString(),
//               item_name: item.name,
//               currency: currentCurrency,
//               price: getNumericPriceForGTM(item.price, currentCurrency, currencyConversionRate),
//               quantity: item.quantity,
//               item_category: item.category || 'N/A',
//               item_brand: item.brand || 'N/A'
//             }));
//             const gtmValue = getNumericPriceForGTM(finalTotal, currentCurrency, currencyConversionRate);
//             const gtmTax = getNumericPriceForGTM(taxAmount, currentCurrency, currencyConversionRate);
//             const gtmShipping = getNumericPriceForGTM(shippingCost, currentCurrency, currencyConversionRate);
//             const gtmDiscount = getNumericPriceForGTM(discountAmount, currentCurrency, currencyConversionRate);

//             window.dataLayer.push({ ecommerce: null });
//             window.dataLayer.push({
//               event: 'purchase',
//               ecommerce: {
//                 transaction_id: orderResponse.data.order_id.toString(),
//                 value: gtmValue,
//                 tax: gtmTax,
//                 shipping: gtmShipping,
//                 currency: currentCurrency,
//                 coupon: appliedCoupon?.code || undefined,
//                 items: gtmItems
//               }
//             });
//             // console.log("GTM: 'purchase' event pushed for order:", orderResponse.data.order_id);
//           }

//           handlePaymentSuccess(orderResponse.data.order_id);
//         } else {
//           handlePaymentFailure();
//           showError(orderResponse.message || t('failed_to_place_order'));
//         }
//       }
//     } catch (error) {
//       console.error("Order submission error:", error);
//       handlePaymentFailure();
//       showError(t('unexpected_error_placing_order'));
//     } finally {
//       dismissToast(toastId);
//       // Note: isPlacingOrder is reset in handlePaymentFailure or after successful online payment initiation
//     }
//   };

//   if (!storeConfig) {
//     return <div>Loading...</div>;
//   }

//   const taxRate = 0;
//   const subtotalAfterDiscount = cartTotal - discountAmount;
//   const taxAmount = subtotalAfterDiscount > 0 ? subtotalAfterDiscount * taxRate : 0;
//   const finalTotal = cartTotal - discountAmount + shippingCost + taxAmount;

//   const paymentSettings = storeConfig.paymentSettings;

//   // Prepare customer info for payment components
//   const customerInfoForPayments = form.getValues(); // Get current form values
//   customerInfoForPayments.city = isDhakaCityAreaSelected ? customerInfoForPayments.dhakaZone : customerInfoForPayments.upazila || customerInfoForPayments.district;
//   customerInfoForPayments.state = customerInfoForPayments.district;
//   customerInfoForPayments.zip = "N/A";
//   customerInfoForPayments.country = "Bangladesh";

//   return (
//     <div className="min-h-screen flex flex-col bg-muted/40">
//       <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
//           <div className="lg:col-start-2">
//             <div className="bg-card p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24">
//               <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('order_summary')}</h2>
//               <div className="space-y-4">
//                 {cartItems.map(item => (
//                   <div key={item.id} className="flex justify-between items-center relative"> {/* Added relative positioning */}
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="absolute -top-2 -left-2 text-muted-foreground hover:text-destructive p-1 z-10" // Positioned top-left
//                       aria-label={`Remove ${item.name}`}
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                     <div className="flex items-center space-x-4 ml-4"> {/* Adjusted margin for the button */}
//                       <div className="relative">
//                         <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
//                         <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
//                       </div>
//                       <div>
//                         <p className="font-semibold">{item.name}</p>
//                         {item.selectedVariantOptions && item.selectedVariantOptions.length > 0 && (
//                           <div className="text-xs text-muted-foreground">
//                             {item.selectedVariantOptions.map((variant, idx) => (
//                               <span key={idx} className="mr-1">
//                                 {variant.type === 'color' && `${t('color')}: ${variant.label}`}
//                                 {variant.type === 'size' && `${t('size')}: ${t(variant.label)}`}
//                                 {variant.type === 'image' && `${t('image_variant')}: ${variant.label}`}
//                                 {idx < item.selectedVariantOptions.length - 1 && ", "}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                         <p className="text-sm text-muted-foreground">
//                           {formatPrice(item.price, currentCurrency, currencyConversionRate)}
//                         </p>
//                         <div className="flex items-center mt-2">
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-8 w-8 rounded-full"
//                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           >
//                             <Minus className="h-4 w-4" />
//                           </Button>
//                           <Input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
//                             className="w-16 h-8 text-center mx-2 border-0 bg-transparent focus-visible:ring-0"
//                             min="1"
//                           />
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-8 w-8 rounded-full"
//                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           >
//                             <Plus className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="font-semibold">
//                       {formatPrice(item.price * item.quantity, currentCurrency, currencyConversionRate)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t mt-6 pt-4 space-y-2">
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>{t('subtotal')}</span>
//                   <span>{formatPrice(cartTotal, currentCurrency, currencyConversionRate)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>{t('shipping')}</span>
//                   <span>{formatPrice(shippingCost, currentCurrency, currencyConversionRate)}</span>
//                 </div>
//                 {discountAmount > 0 && (
//                   <div className="flex justify-between text-muted-foreground">
//                     <span>{t('discount')} ({appliedCoupon?.code})</span>
//                     <span className="text-destructive">-{formatPrice(discountAmount, currentCurrency, currencyConversionRate)}</span>
//                   </div>
//                 )}
//                 {/* <div className="flex justify-between text-muted-foreground">
//                   <span>{t('tax')} (5%)</span>
//                   <span>{formatPrice(taxAmount, currentCurrency, currencyConversionRate)}</span>
//                 </div> */}
//                 <div className="flex justify-between text-xl font-bold mt-2">
//                   <span>{t('total')}</span>
//                   <span>{formatPrice(finalTotal, currentCurrency, currencyConversionRate)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-start-1 lg:row-start-1">
//             <div className="bg-card p-6 rounded-lg shadow-sm">
//               <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: `var(--dynamic-heading-font)` }}>{t('shipping_information')}</h2>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="firstName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>{t('your_name')} *</FormLabel>
//                         <FormControl>
//                           <InputWithLeadingIcon icon={User} placeholder={t('your_name')} {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="phone"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>{t('phone_number')} *</FormLabel>
//                         <FormControl>
//                           <InputWithLeadingIcon icon={Phone} placeholder={t('phone_number')} {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="address"
//                     render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>{t('your_address')} *</FormLabel>
//                           <FormControl>
//                             <InputWithLeadingIcon icon={MapPin} placeholder={t('your_address')} {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                     )}
//                   />

//                   {/* Division Dropdown */}
//                   <FormField
//                     control={form.control}
//                     name="division"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">{t('division')} *</FormLabel>
//                         <FormControl>
//                           <CustomDropdown
//                             options={DIVISION_OPTIONS}
//                             value={field.value}
//                             onChange={field.onChange}
//                             placeholder={t('select_division')}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Conditional District Dropdown */}
//                   {selectedDivision && (
//                     <FormField
//                       control={form.control}
//                       name="district"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-base font-semibold">{t('district')} *</FormLabel>
//                           <FormControl>
//                             <CustomDropdown
//                               options={filteredDistricts}
//                               value={field.value}
//                               onChange={field.onChange}
//                               placeholder={t('select_district')}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   )}

//                   {/* Conditional Dhaka Zone Dropdown */}
//                   {isDhakaCityAreaSelected && (
//                     <FormField
//                       control={form.control}
//                       name="dhakaZone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-base font-semibold">{t('zone')} *</FormLabel>
//                           <FormControl>
//                             <CustomDropdown
//                               options={DHAKA_ZONE_OPTIONS}
//                               value={field.value}
//                               onChange={field.onChange}
//                               placeholder={t('select_zone')}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   )}

//                   {/* Conditional Upazila Dropdown */}
//                   {selectedDistrict && !isDhakaCityAreaSelected && (
//                     <FormField
//                       control={form.control}
//                       name="upazila"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel className="text-base font-semibold">{t('upazila')} *</FormLabel>
//                           <FormControl>
//                             <CustomDropdown
//                               options={filteredUpazilas}
//                               value={field.value}
//                               onChange={field.onChange}
//                               placeholder={t('select_upazila')}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   )}

//                    <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>{t('email')} <span className="text-muted-foreground">{t('optional')}</span></FormLabel>
//                         <FormControl>
//                           <InputWithLeadingIcon icon={Mail} placeholder={t('your_email')} {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Order Note */}
//                   <FormField
//                     control={form.control}
//                     name="orderNote"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">{t('order_note')}</FormLabel>
//                         <FormControl>
//                           <div className="relative flex items-center">
//                             <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-muted rounded-l-md border border-r-0 border-input text-muted-foreground">
//                               <Menu className="h-5 w-5" /> {/* Using Menu icon for notes */}
//                             </div>
//                             <Textarea placeholder={t('order_note')} className="pl-14 min-h-[80px] rounded-l-none border-l-0" {...field} />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Payment Method Selection */}
//                   <div className="pt-4 border-t border-border">
//                     <h3 className="text-lg font-bold mb-4" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
//                       {t('payment_method')}
//                     </h3>
//                     <RadioGroup
//                       value={selectedPaymentMethod}
//                       onValueChange={setSelectedPaymentMethod}
//                       className="space-y-3"
//                     >
//                       {paymentSettings?.cod_enabled && (
//                         <div className="flex items-center space-x-2 p-3 border rounded-md">
//                           <RadioGroupItem value="Cash On Delivery" id="payment-cod" />
//                           <Label htmlFor="payment-cod" className="cursor-pointer text-base">
//                             {t('cash_on_delivery')}
//                           </Label>
//                         </div>
//                       )}
//                       {paymentSettings?.mfs_enabled && (
//                         <div className="flex flex-col p-3 border rounded-md">
//                           <div className="flex items-center space-x-2">
//                             <RadioGroupItem value={paymentSettings.mfs_method || "MFS"} id="payment-mfs" />
//                             <Label htmlFor="payment-mfs" className="cursor-pointer text-base">
//                               {paymentSettings.mfs_method ? paymentSettings.mfs_method.charAt(0).toUpperCase() + paymentSettings.mfs_method.slice(1) : t('mobile_financial_service')}
//                             </Label>
//                           </div>
//                           {selectedPaymentMethod === (paymentSettings.mfs_method || "MFS") && (
//                             <div className="text-sm text-muted-foreground mt-2 ml-7">
//                               <p>{t('mfs_instruction')}: {paymentSettings.mfs_instruction}</p>
//                               <p>{t('send_money_to')}: {paymentSettings.mfs_phone_number}</p>
//                               {paymentSettings.advance_payment_type === "percentage" && paymentSettings.advance_payment_value && (
//                                 <p className="text-red-600">{t('advance_payment_required')}: {paymentSettings.advance_payment_value}%</p>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {paymentSettings?.bkash_enabled && (
//                         <div className="flex flex-col p-3 border rounded-md">
//                           <div className="flex items-center space-x-2">
//                             <RadioGroupItem value="bKash" id="payment-bkash" />
//                             <Label htmlFor="payment-bkash" className="cursor-pointer text-base">
//                               bKash
//                             </Label>
//                           </div>
//                           {selectedPaymentMethod === "bKash" && (
//                             <div className="text-sm text-muted-foreground mt-2 ml-7">
//                               <p>{t('bkash_instruction')}</p>
//                               {paymentSettings.advance_payment_type === "percentage" && paymentSettings.advance_payment_value && (
//                                 <p className="text-red-600">{t('advance_payment_required')}: {paymentSettings.advance_payment_value}%</p>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}
//                       {paymentSettings?.aamarpay_enabled && (
//                         <div className="flex items-center space-x-2 p-3 border rounded-md">
//                           <RadioGroupItem value="Aamarpay" id="payment-aamarpay" />
//                           <Label htmlFor="payment-aamarpay" className="cursor-pointer text-base">
//                             {t('pay_with_card_mobile')} {/* Updated label here */}
//                           </Label>
//                         </div>
//                       )}
//                       {paymentSettings?.bizscale_enabled && (
//                         <div className="flex items-center space-x-2 p-3 border rounded-md">
//                           <RadioGroupItem value="Bizscale" id="payment-bizscale" />
//                           <Label htmlFor="payment-bizscale" className="cursor-pointer text-base">
//                             Bizscale Pay
//                           </Label>
//                         </div>
//                       )}
//                     </RadioGroup>
//                     {paymentSettings?.note && (
//                       <p className="text-sm text-muted-foreground mt-4">
//                         {paymentSettings.note}
//                       </p>
//                     )}
//                   </div>

//                   {/* Coupon Section */}
//                   <div className="pt-4">
//                     <h3 className="text-lg font-bold mb-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
//                       {t('apply_coupon')}
//                     </h3>
//                     <div className="flex space-x-2">
//                       <Input
//                         type="text"
//                         placeholder={t('enter_coupon_code')}
//                         value={couponCodeInput}
//                         onChange={(e) => setCouponCodeInput(e.target.value)}
//                         className="flex-grow"
//                       />
//                       <ThemedButton onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
//                         {isApplyingCoupon ? t('applying') : t('apply')}
//                       </ThemedButton>
//                     </div>
//                     {couponMessage.text && (
//                       <p className={`text-sm mt-2 ${couponMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
//                         {couponMessage.text}
//                       </p>
//                     )}
//                   </div>

//                   {/* Submit Button for COD or Placeholder for Online Payments */}
//                   {selectedPaymentMethod === "Cash On Delivery" ? (
//                     <ThemedButton type="submit" className="w-full !mt-8" disabled={isPlacingOrder}>
//                       {isPlacingOrder ? t('placing_order') : t('place_order_pay', { total: formatPrice(finalTotal, currentCurrency, currencyConversionRate) })}
//                     </ThemedButton>
//                   ) : (
//                     <div className="w-full !mt-8 space-y-4">
//                       <p className="text-center text-sm text-muted-foreground">
//                         {t('complete_form_then_pay_online')}
//                       </p>
//                       {/* Render specific payment buttons here, passing necessary props */}
//                       {selectedPaymentMethod === "bKash" && paymentSettings?.bkash_enabled && (
//                         <BkashPayment
//                           amount={finalTotal}
//                           orderId={incompleteOrderId} // Use the incompleteOrderId
//                           customerInfo={customerInfoForPayments}
//                           onPaymentSuccess={handlePaymentSuccess}
//                           onPaymentFailure={handlePaymentFailure}
//                         />
//                       )}
//                       {selectedPaymentMethod === (paymentSettings?.mfs_method || "MFS") && paymentSettings?.mfs_enabled && (
//                         <NagadPayment
//                           amount={finalTotal}
//                           orderId={incompleteOrderId} // Use the incompleteOrderId
//                           customerInfo={customerInfoForPayments}
//                           onPaymentSuccess={handlePaymentSuccess}
//                           onPaymentFailure={handlePaymentFailure}
//                         />
//                       )}
//                       {selectedPaymentMethod === "Aamarpay" && paymentSettings?.aamarpay_enabled && (
//                         <SslCommerzPayment // Using SslCommerzPayment for Aamarpay as per example
//                           amount={finalTotal}
//                           orderId={incompleteOrderId} // Use the incompleteOrderId
//                           customerInfo={customerInfoForPayments}
//                           onPaymentSuccess={handlePaymentSuccess}
//                           onPaymentFailure={handlePaymentFailure}
//                         />
//                       )}
//                       {selectedPaymentMethod === "Bizscale" && paymentSettings?.bizscale_enabled && (
//                         <ThemedButton
//                           onClick={() => showError(t('bizscale_pay_not_implemented'))}
//                           disabled={isPlacingOrder || !incompleteOrderId}
//                           className="w-full bg-blue-800 hover:bg-blue-900 text-white"
//                         >
//                           {t('pay_with_bizscale')}
//                         </ThemedButton>
//                       )}
//                     </div>
//                   )}
//                 </form>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer layout={storeConfig.layout.footer} copyrightText={storeConfig.layout.footer.copyrightText} socialLinks={storeConfig.layout.footer.socialLinks} logoUrl={storeConfig.storeConfiguration.logoUrl} storeName={storeConfig.storeConfiguration.storeName} />
//     </div>
//   );
// };

// export default Checkout;

// "use client";

// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "@/context/CartContext.jsx";
// import { useStore } from "@/context/StoreContext.jsx";
// import { Header } from "@/components/Header";
// import { Footer } from "@/components/Footer";
// import ThemedButton from "@/components/ThemedButton.jsx";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "@/utils/toast";
// import {
//   validateCoupon,
//   createIncompleteOrder,
//   updateOrder,
//   fetchCategories,
// } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
// import { useTranslation } from "react-i18next";
// import { useStorePath } from "@/hooks/use-store-path";
// import { useDebounce } from "@/hooks/use-debounce";
// import { Button } from "@/components/ui/button";
// import { Plus, Minus, User, Phone, MapPin, X } from "lucide-react";
// import { formatPrice } from "@/lib/utils";
// import InputWithLeadingIcon from "@/components/InputWithLeadingIcon";
// import { DIVISION_OPTIONS } from "@/data/divisions";
// import { DISTRICT_OPTIONS } from "@/data/districts";
// import { UPAZILA_OPTIONS } from "@/data/upazilas";
// import { DHAKA_ZONE_OPTIONS } from "@/data/dhakaZones";
// import CustomDropdown from "@/components/CustomDropdown";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

// import BkashPayment from "@/components/payment/BkashPayment";

// const checkoutSchema = z.object({
//   firstName: z.string().min(1, { message: "Name is required." }),
//   phone: z.string().min(1, { message: "Phone number is required." }),
//   address: z.string().min(1, { message: "Address is required." }),
//   division: z.string().min(1, { message: "Division is required." }),
//   district: z.string().min(1, { message: "District is required." }),
//   upazila: z.string().optional(),
//   dhakaZone: z.string().optional(),
//   email: z.string().email().optional().or(z.literal("")),
//   orderNote: z.string().optional(),
// });

// const Checkout = () => {
//   const { t } = useTranslation();
//   const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } =
//     useCart();
//   const { storeConfig, currentCurrency, currencyConversionRate } = useStore();
//   const navigate = useNavigate();
//   const getPath = useStorePath();

//   const [couponCodeInput, setCouponCodeInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//   const [incompleteOrderId, setIncompleteOrderId] = useState(null);
//   const [shippingCost, setShippingCost] = useState(0);

//   // Refs to prevent loops
//   const incompleteOrderIdRef = useRef(null);
//   const isSavingRef = useRef(false);
//   const lastSavedDataRef = useRef(""); // Stores JSON string of last payload

//   const form = useForm({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: {
//       firstName: "",
//       phone: "",
//       address: "",
//       division: "",
//       district: "",
//       upazila: "",
//       dhakaZone: "",
//       email: "",
//       orderNote: "",
//     },
//   });

//   const formValues = form.watch();
//   const debouncedFormValues = useDebounce(formValues, 1000);

//   // Calculate shipping cost logic
//   useEffect(() => {
//     if (!storeConfig) return;
//     const freeThreshold = parseFloat(
//       storeConfig?.deliverySettings?.buy_amount_to_get_free_delivery || 0
//     );
//     if (cartTotal >= freeThreshold && freeThreshold > 0) {
//       setShippingCost(0);
//       return;
//     }
//     const zones = storeConfig?.deliverySettings?.zones || [];
//     const match = zones.find(
//       (z) =>
//         z.zone_name === debouncedFormValues.district ||
//         z.zone_name === debouncedFormValues.upazila
//     );
//     setShippingCost(
//       match
//         ? parseFloat(match.charge)
//         : parseFloat(storeConfig?.deliverySettings?.default_charge || 0)
//     );
//   }, [
//     debouncedFormValues.district,
//     debouncedFormValues.upazila,
//     cartTotal,
//     storeConfig,
//   ]);

//   // --- THE FIX: AUTO-SAVE WATCHER ---
//   useEffect(() => {
//     const handleAutoSave = async () => {
//       // 1. Basic validation
//       if (
//         cartItems.length === 0 ||
//         (!debouncedFormValues.firstName && !debouncedFormValues.phone)
//       )
//         return;

//       // 2. Prepare payload
//       const currentPayload = {
//         customer_phone: debouncedFormValues.phone,
//         customer_email: debouncedFormValues.email || "customer@example.com",
//         shipping_address: {
//           address: debouncedFormValues.address,
//           city: debouncedFormValues.district,
//         },
//         order_items: cartItems.map((i) => ({
//           product_id: i.id,
//           quantity: i.quantity,
//         })),
//         shipping_cost: shippingCost,
//         discount_amount: discountAmount,
//         status: "incomplete",
//       };

//       const payloadString = JSON.stringify(currentPayload);

//       // 3. Loop Guard: Only save if data actually changed AND not currently saving
//       if (payloadString === lastSavedDataRef.current || isSavingRef.current)
//         return;

//       isSavingRef.current = true;
//       lastSavedDataRef.current = payloadString;

//       try {
//         let response;
//         if (incompleteOrderIdRef.current) {
//           // MySQL Update
//           response = await updateOrder(
//             incompleteOrderIdRef.current,
//             currentPayload
//           );
//         } else {
//           // Initial Create
//           response = await createIncompleteOrder(currentPayload);
//         }

//         if (response?.status === "success" && response.data?.order_id) {
//           incompleteOrderIdRef.current = response.data.order_id;
//           setIncompleteOrderId(response.data.order_id);
//         }
//       } catch (error) {
//         console.error("Auto-save failed", error);
//       } finally {
//         isSavingRef.current = false;
//       }
//     };

//     handleAutoSave();
//   }, [debouncedFormValues, cartItems, shippingCost, discountAmount]);

//   const onSubmit = async (data) => {
//     if (!selectedPaymentMethod)
//       return showError(t("please_select_payment_method"));
//     setIsPlacingOrder(true);
//     const tid = showLoading(t("placing_order"));
//     try {
//       const finalData = {
//         ...data,
//         status:
//           selectedPaymentMethod === "Cash On Delivery"
//             ? "completed"
//             : "pending_payment",
//       };
//       const res = await updateOrder(incompleteOrderIdRef.current, finalData);
//       if (res.status === "success") {
//         clearCart();
//         navigate(getPath("/order-confirmation"), {
//           state: { orderId: incompleteOrderIdRef.current },
//         });
//       }
//     } catch (e) {
//       showError("Submission failed");
//     } finally {
//       dismissToast(tid);
//       setIsPlacingOrder(false);
//     }
//   };

//   if (!storeConfig) return null;

//   return (
//     <div className="min-h-screen flex flex-col bg-muted/40">
//       <Header
//         layout={storeConfig.layout}
//         storeName={storeConfig.storeConfiguration.storeName}
//         logoUrl={storeConfig.storeConfiguration.logoUrl}
//       />

//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Form Side */}
//           <div className="bg-card p-6 rounded-lg shadow-sm">
//             <h2 className="text-2xl font-bold mb-6">
//               {t("shipping_information")}
//             </h2>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("name")}</FormLabel>
//                       <FormControl>
//                         <InputWithLeadingIcon icon={User} {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("phone")}</FormLabel>
//                       <FormControl>
//                         <InputWithLeadingIcon icon={Phone} {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>{t("address")}</FormLabel>
//                       <FormControl>
//                         <InputWithLeadingIcon icon={MapPin} {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="pt-4 border-t">
//                   <h3 className="text-lg font-bold mb-4">
//                     {t("payment_method")}
//                   </h3>
//                   <RadioGroup
//                     value={selectedPaymentMethod}
//                     onValueChange={setSelectedPaymentMethod}
//                     className="space-y-3"
//                   >
//                     <div className="flex items-center space-x-2 p-3 border rounded-md">
//                       <RadioGroupItem value="Cash On Delivery" id="cod" />
//                       <Label htmlFor="cod" className="flex-grow cursor-pointer">
//                         {t("cash_on_delivery")}
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2 p-3 border rounded-md">
//                       <RadioGroupItem value="bKash" id="bkash" />
//                       <Label
//                         htmlFor="bkash"
//                         className="flex-grow cursor-pointer"
//                       >
//                         bKash
//                       </Label>
//                     </div>
//                   </RadioGroup>
//                 </div>

//                 {selectedPaymentMethod === "Cash On Delivery" ? (
//                   <ThemedButton
//                     type="submit"
//                     className="w-full h-12"
//                     disabled={isPlacingOrder}
//                   >
//                     {isPlacingOrder ? "..." : t("confirm_order")}
//                   </ThemedButton>
//                 ) : (
//                   selectedPaymentMethod === "bKash" && (
//                     <BkashPayment
//                       amount={cartTotal + shippingCost - discountAmount}
//                       orderId={incompleteOrderId}
//                     />
//                   )
//                 )}
//               </form>
//             </Form>
//           </div>

//           {/* Summary Side */}
//           <div className="lg:col-start-2">
//             <div className="bg-card p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24 border">
//               <h2
//                 className="text-2xl font-bold mb-6"
//                 style={{ fontFamily: `var(--dynamic-heading-font)` }}
//               >
//                 {t("order_summary")}
//               </h2>

//               {/* Scrollable Cart Items Container */}
//               <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
//                 {cartItems.length > 0 ? (
//                   cartItems.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex justify-between items-start relative border-b pb-4 last:border-0 last:pb-0"
//                     >
//                       {/* Remove Button */}
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="absolute -top-1 -left-1 bg-background rounded-full shadow-sm text-muted-foreground hover:text-destructive p-1 z-10 border transition-colors"
//                         aria-label={`Remove ${item.name}`}
//                       >
//                         <X className="h-3 w-3" />
//                       </button>

//                       <div className="flex items-start space-x-4 ml-4">
//                         {/* Product Image & Quantity Badge */}
//                         <div className="relative flex-shrink-0">
//                           <img
//                             src={item.imageUrl}
//                             alt={item.name}
//                             className="w-20 h-20 object-cover rounded-md border"
//                           />
//                           <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
//                             {item.quantity}
//                           </span>
//                         </div>

//                         {/* Product Details */}
//                         <div className="flex-grow min-w-0">
//                           <p className="font-semibold text-sm leading-tight truncate mb-1">
//                             {item.name}
//                           </p>

//                           {/* Variants Display */}
//                           {item.selectedVariantOptions?.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mb-2">
//                               {item.selectedVariantOptions.map(
//                                 (variant, idx) => (
//                                   <span
//                                     key={idx}
//                                     className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
//                                   >
//                                     {variant.type === "color"
//                                       ? t("color")
//                                       : t(variant.type)}
//                                     : {variant.label}
//                                   </span>
//                                 )
//                               )}
//                             </div>
//                           )}

//                           <p className="text-sm font-medium text-muted-foreground">
//                             {formatPrice(
//                               item.price,
//                               currentCurrency,
//                               currencyConversionRate
//                             )}
//                           </p>

//                           {/* Quantity Controls */}
//                           <div className="flex items-center mt-3 bg-muted/50 w-fit rounded-full p-1 border">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-6 w-6 rounded-full hover:bg-background"
//                               onClick={() =>
//                                 updateQuantity(item.id, item.quantity - 1)
//                               }
//                               disabled={item.quantity <= 1}
//                             >
//                               <Minus className="h-3 w-3" />
//                             </Button>
//                             <Input
//                               type="number"
//                               value={item.quantity}
//                               onChange={(e) => {
//                                 const val = parseInt(e.target.value);
//                                 if (val > 0) updateQuantity(item.id, val);
//                               }}
//                               className="w-8 h-6 text-center text-xs border-0 bg-transparent p-0 focus-visible:ring-0 appearance-none"
//                               min="1"
//                             />
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-6 w-6 rounded-full hover:bg-background"
//                               onClick={() =>
//                                 updateQuantity(item.id, item.quantity + 1)
//                               }
//                             >
//                               <Plus className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Total Price for Item */}
//                       <div className="text-right flex-shrink-0">
//                         <p className="font-bold text-sm">
//                           {formatPrice(
//                             item.price * item.quantity,
//                             currentCurrency,
//                             currencyConversionRate
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="py-10 text-center text-muted-foreground">
//                     <p>{t("your_cart_is_empty")}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Totals Section */}
//               <div className="border-t mt-6 pt-4 space-y-3">
//                 <div className="flex justify-between text-sm text-muted-foreground">
//                   <span>{t("subtotal")}</span>
//                   <span>
//                     {formatPrice(
//                       cartTotal,
//                       currentCurrency,
//                       currencyConversionRate
//                     )}
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-sm text-muted-foreground">
//                   <span>{t("shipping")}</span>
//                   <span
//                     className={
//                       shippingCost === 0 ? "text-green-600 font-medium" : ""
//                     }
//                   >
//                     {shippingCost === 0
//                       ? t("free")
//                       : formatPrice(
//                           shippingCost,
//                           currentCurrency,
//                           currencyConversionRate
//                         )}
//                   </span>
//                 </div>

//                 {discountAmount > 0 && (
//                   <div className="flex justify-between text-sm transition-all animate-in fade-in slide-in-from-top-1">
//                     <div className="flex items-center gap-1 text-green-600">
//                       <span>{t("discount")}</span>
//                       {appliedCoupon?.code && (
//                         <span className="text-[10px] border border-green-200 bg-green-50 px-1 rounded">
//                           {appliedCoupon.code}
//                         </span>
//                       )}
//                     </div>
//                     <span className="text-green-600 font-medium">
//                       -
//                       {formatPrice(
//                         discountAmount,
//                         currentCurrency,
//                         currencyConversionRate
//                       )}
//                     </span>
//                   </div>
//                 )}

//                 {/* Tax Placeholder (Uncomment if needed) */}
//                 {/* <div className="flex justify-between text-sm text-muted-foreground">
//         <span>{t('tax')}</span>
//         <span>{formatPrice(taxAmount, currentCurrency, currencyConversionRate)}</span>
//       </div> 
//       */}

//                 <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-double">
//                   <span>{t("total")}</span>
//                   <span className="text-primary">
//                     {formatPrice(
//                       finalTotal,
//                       currentCurrency,
//                       currencyConversionRate
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer
//         layout={storeConfig?.layout?.footer || {}}
//         socialLinks={storeConfig?.layout?.footer?.socialLinks || []}
//         logoUrl={storeConfig?.storeConfiguration?.logoUrl}
//         storeName={storeConfig?.storeConfiguration?.storeName}
//       />
//     </div>
//   );
// };

// export default Checkout;

// "use client";

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "@/context/CartContext.jsx";
// import { useStore } from "@/context/StoreContext.jsx";
// import { Header } from "@/components/Header";
// import { Footer } from "@/components/Footer";
// import ThemedButton from "@/components/ThemedButton.jsx";
// import { Input } from "@/components/ui/input";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
// import { validateCoupon, createIncompleteOrder, updateOrder, fetchCategories } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
// import { useTranslation } from "react-i18next";
// import { useStorePath } from "@/hooks/use-store-path";
// import { useDebounce } from "@/hooks/use-debounce";
// import { Button } from "@/components/ui/button";
// import { Plus, Minus, User, Phone, MapPin, X, Mail } from "lucide-react";
// import { formatPrice } from "@/lib/utils";
// import InputWithLeadingIcon from "@/components/InputWithLeadingIcon";
// import { DIVISION_OPTIONS } from "@/data/divisions";
// import { DISTRICT_OPTIONS } from "@/data/districts";
// import { UPAZILA_OPTIONS } from "@/data/upazilas";
// import { DHAKA_ZONE_OPTIONS } from "@/data/dhakaZones";
// import CustomDropdown from "@/components/CustomDropdown";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

// // Payment components
// import BkashPayment from "@/components/payment/BkashPayment";

// const checkoutSchema = z.object({
//   firstName: z.string().min(1, { message: "Name is required." }),
//   phone: z.string().min(1, { message: "Phone number is required." }),
//   address: z.string().min(1, { message: "Address is required." }),
//   division: z.string().min(1, { message: "Division is required." }),
//   district: z.string().min(1, { message: "District is required." }),
//   upazila: z.string().optional(),
//   dhakaZone: z.string().optional(),
//   email: z.string().email().optional().or(z.literal('')),
//   orderNote: z.string().optional(),
// }).superRefine((data, ctx) => {
//   const selectedDivisionObj = DIVISION_OPTIONS.find(div => div.name === data.division);
//   const selectedDistrictObj = DISTRICT_OPTIONS.find(dist => dist.name === data.district);
//   const isDhakaDivision = selectedDivisionObj?.name === "Dhaka";
//   const isDhakaCityDistrict = selectedDistrictObj?.name === "Dhaka City";

//   if (isDhakaDivision && isDhakaCityDistrict) {
//     if (!data.dhakaZone) {
//       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Dhaka Zone is required.", path: ["dhakaZone"] });
//     }
//   } else if (data.district && !isDhakaCityDistrict) {
//     if (!data.upazila) {
//       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Upazila is required.", path: ["upazila"] });
//     }
//   }
// });

// const Checkout = () => {
//   const { t } = useTranslation();
//   const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
//   const { storeConfig, currentCurrency, currencyConversionRate } = useStore();
//   const navigate = useNavigate();
//   const getPath = useStorePath();

//   const [couponCodeInput, setCouponCodeInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//   const [incompleteOrderId, setIncompleteOrderId] = useState(null);
//   const [shippingCost, setShippingCost] = useState(0);

//   const incompleteOrderIdRef = useRef(null);
//   const isSavingRef = useRef(false);
//   const lastSavedDataRef = useRef("");

//   const form = useForm({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: { firstName: "", phone: "", address: "", division: "", district: "", upazila: "", dhakaZone: "", email: "", orderNote: "" },
//   });

//   const formValues = form.watch();
//   const debouncedFormValues = useDebounce(formValues, 1000);

//   const isDhakaCityAreaSelected = debouncedFormValues.division === "Dhaka" && debouncedFormValues.district === "Dhaka City";

//   // --- CALCULATION ---
//   const finalTotal = useMemo(() => {
//     return cartTotal + shippingCost - discountAmount;
//   }, [cartTotal, shippingCost, discountAmount]);

//   useEffect(() => {
//     if (!storeConfig) return;
//     const freeThreshold = parseFloat(storeConfig?.deliverySettings?.buy_amount_to_get_free_delivery || 0);
//     if (cartTotal >= freeThreshold && freeThreshold > 0) {
//       setShippingCost(0);
//       return;
//     }
//     const zones = storeConfig?.deliverySettings?.zones || [];
//     const match = zones.find(z => z.zone_name === debouncedFormValues.district || z.zone_name === debouncedFormValues.upazila);
//     setShippingCost(match ? parseFloat(match.charge) : parseFloat(storeConfig?.deliverySettings?.default_charge || 0));
//   }, [debouncedFormValues.district, debouncedFormValues.upazila, cartTotal, storeConfig]);

//   // --- AUTO-SAVE LOGIC (FIXES INFINITE LOOP) ---
//   useEffect(() => {
//     const handleAutoSave = async () => {
//       if (cartItems.length === 0 || (!debouncedFormValues.firstName && !debouncedFormValues.phone)) return;

//       const currentPayload = {
//         customer_phone: debouncedFormValues.phone,
//         customer_email: debouncedFormValues.email || "customer@example.com",
//         shipping_address: { 
//           address: debouncedFormValues.address, 
//           city: isDhakaCityAreaSelected ? debouncedFormValues.dhakaZone : debouncedFormValues.upazila || debouncedFormValues.district 
//         },
//         order_items: cartItems.map(i => ({ product_id: i.id, quantity: i.quantity })),
//         shipping_cost: shippingCost,
//         discount_amount: discountAmount,
//         customer_notes: debouncedFormValues.orderNote,
//         status: "incomplete"
//       };

//       const payloadString = JSON.stringify(currentPayload);
//       if (payloadString === lastSavedDataRef.current || isSavingRef.current) return;

//       isSavingRef.current = true;
//       lastSavedDataRef.current = payloadString;

//       try {
//         let response;
//         if (incompleteOrderIdRef.current) {
//           response = await updateOrder(incompleteOrderIdRef.current, currentPayload);
//         } else {
//           response = await createIncompleteOrder(currentPayload);
//         }

//         if (response?.status === "success" && response.data?.order_id) {
//           incompleteOrderIdRef.current = response.data.order_id;
//           setIncompleteOrderId(response.data.order_id);
//         }
//       } catch (error) {
//         console.error("Auto-save failed", error);
//       } finally {
//         isSavingRef.current = false;
//       }
//     };
//     handleAutoSave();
//   }, [debouncedFormValues, cartItems, shippingCost, discountAmount, isDhakaCityAreaSelected]);

//   const filteredDistricts = useMemo(() => {
//     const div = DIVISION_OPTIONS.find(d => d.name === formValues.division);
//     return div ? DISTRICT_OPTIONS.filter(d => d.division_id === div.id) : [];
//   }, [formValues.division]);

//   const filteredUpazilas = useMemo(() => {
//     if (isDhakaCityAreaSelected) return [];
//     const dist = DISTRICT_OPTIONS.find(d => d.name === formValues.district);
//     return dist ? UPAZILA_OPTIONS.filter(u => u.district_id === dist.id) : [];
//   }, [formValues.district, isDhakaCityAreaSelected]);

//   const { data: allCategories } = useQuery({
//     queryKey: ['allCategoriesForCoupon'],
//     queryFn: fetchCategories,
//     staleTime: 1000 * 60 * 60,
//   });

//   const handleApplyCoupon = async () => {
//     if (!couponCodeInput.trim()) return;
//     setIsApplyingCoupon(true);
//     try {
//       const res = await validateCoupon({ code: couponCodeInput, productIds: cartItems.map(i => i.id) });
//       if (res.success) {
//         let disc = res.data.discount_type === "percent" ? (cartTotal * parseFloat(res.data.discount_value)) / 100 : parseFloat(res.data.discount_value);
//         setAppliedCoupon(res.data);
//         setDiscountAmount(Math.min(disc, cartTotal));
//         setCouponMessage({ text: t('coupon_applied'), type: "success" });
//       } else {
//         setCouponMessage({ text: res.message, type: "error" });
//       }
//     } catch (e) {
//       showError(t('error_applying_coupon'));
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!selectedPaymentMethod) return showError(t('please_select_payment_method'));
//     setIsPlacingOrder(true);
//     const tid = showLoading(t('placing_order'));
//     try {
//       const finalData = { 
//         ...data, 
//         status: selectedPaymentMethod === "Cash On Delivery" ? "pending" : "pending_payment",
//         payment_method: selectedPaymentMethod 
//       };
//       const res = await updateOrder(incompleteOrderIdRef.current, finalData);
//       if (res.status === "success") {
//         clearCart();
//         navigate(getPath("/order-confirmation"), { state: { orderId: incompleteOrderIdRef.current } });
//       }
//     } catch (e) {
//       showError("Submission failed");
//     } finally {
//       dismissToast(tid);
//       setIsPlacingOrder(false);
//     }
//   };

//   if (!storeConfig) return null;

//   return (
//     <div className="min-h-screen flex flex-col bg-muted/40">
//       <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} />
      
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* Detailed Order Summary Section */}
//           <div className="lg:col-start-2">
//             <div className="bg-card p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24 border">
//               <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
//                 {t('order_summary')}
//               </h2>

//               <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
//                 {cartItems.length > 0 ? (
//                   cartItems.map((item) => (
//                     <div key={item.id} className="flex justify-between items-start relative border-b pb-4 last:border-0 last:pb-0">
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="absolute -top-1 -left-1 bg-background rounded-full shadow-sm text-muted-foreground hover:text-destructive p-1 z-10 border"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>

//                       <div className="flex items-start space-x-4 ml-4">
//                         <div className="relative flex-shrink-0">
//                           <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md border" />
//                           <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                             {item.quantity}
//                           </span>
//                         </div>

//                         <div className="flex-grow min-w-0">
//                           <p className="font-semibold text-sm truncate mb-1">{item.name}</p>
//                           {item.selectedVariantOptions?.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mb-2">
//                               {item.selectedVariantOptions.map((v, i) => (
//                                 <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
//                                   {t(v.type)}: {v.label}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                           <p className="text-sm text-muted-foreground">{formatPrice(item.price, currentCurrency, currencyConversionRate)}</p>
//                           <div className="flex items-center mt-2 bg-muted/50 w-fit rounded-full p-1 border">
//                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></Button>
//                             <span className="px-2 text-xs">{item.quantity}</span>
//                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-sm">{formatPrice(item.price * item.quantity, currentCurrency, currencyConversionRate)}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="py-10 text-center text-muted-foreground"><p>{t('your_cart_is_empty')}</p></div>
//                 )}
//               </div>

//               <div className="border-t mt-6 pt-4 space-y-3">
//                 <div className="flex justify-between text-sm text-muted-foreground"><span>{t('subtotal')}</span><span>{formatPrice(cartTotal, currentCurrency, currencyConversionRate)}</span></div>
//                 <div className="flex justify-between text-sm text-muted-foreground"><span>{t('shipping')}</span><span>{shippingCost === 0 ? t('free') : formatPrice(shippingCost, currentCurrency, currencyConversionRate)}</span></div>
//                 {discountAmount > 0 && (
//                   <div className="flex justify-between text-sm text-green-600 font-medium">
//                     <span>{t('discount')} ({appliedCoupon?.code})</span>
//                     <span>-{formatPrice(discountAmount, currentCurrency, currencyConversionRate)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-double"><span>{t('total')}</span><span className="text-primary">{formatPrice(finalTotal, currentCurrency, currencyConversionRate)}</span></div>
//               </div>
//             </div>
//           </div>

//           {/* Shipping Form Section */}
//           <div className="lg:col-start-1 lg:row-start-1">
//             <div className="bg-card p-6 rounded-lg shadow-sm border">
//               <h2 className="text-2xl font-bold mb-6">{t('shipping_information')}</h2>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                   <FormField control={form.control} name="firstName" render={({ field }) => (
//                     <FormItem><FormLabel>{t('your_name')} *</FormLabel><FormControl><InputWithLeadingIcon icon={User} placeholder={t('your_name')} {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   <FormField control={form.control} name="phone" render={({ field }) => (
//                     <FormItem><FormLabel>{t('phone_number')} *</FormLabel><FormControl><InputWithLeadingIcon icon={Phone} placeholder="01XXXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />
//                   {/* FIXED SYNTAX ERROR HERE: Closing tag changed from </FormMessage> to </FormItem> */}
//                   <FormField control={form.control} name="address" render={({ field }) => (
//                     <FormItem><FormLabel>{t('your_address')} *</FormLabel><FormControl><InputWithLeadingIcon icon={MapPin} placeholder={t('your_address')} {...field} /></FormControl><FormMessage /></FormItem>
//                   )} />

//                   <div className="grid grid-cols-2 gap-4">
//                     <FormField control={form.control} name="division" render={({ field }) => (
//                       <FormItem><FormLabel>{t('division')} *</FormLabel><CustomDropdown options={DIVISION_OPTIONS} value={field.value} onChange={field.onChange} placeholder={t('select')} /><FormMessage /></FormItem>
//                     )} />
//                     <FormField control={form.control} name="district" render={({ field }) => (
//                       <FormItem><FormLabel>{t('district')} *</FormLabel><CustomDropdown options={filteredDistricts} value={field.value} onChange={field.onChange} placeholder={t('select')} /><FormMessage /></FormItem>
//                     )} />
//                   </div>

//                   {isDhakaCityAreaSelected ? (
//                     <FormField control={form.control} name="dhakaZone" render={({ field }) => (
//                       <FormItem><FormLabel>{t('zone')} *</FormLabel><CustomDropdown options={DHAKA_ZONE_OPTIONS} value={field.value} onChange={field.onChange} placeholder={t('select_zone')} /><FormMessage /></FormItem>
//                     )} />
//                   ) : (
//                     <FormField control={form.control} name="upazila" render={({ field }) => (
//                       <FormItem><FormLabel>{t('upazila')} *</FormLabel><CustomDropdown options={filteredUpazilas} value={field.value} onChange={field.onChange} placeholder={t('select_upazila')} /><FormMessage /></FormItem>
//                     )} />
//                   )}

//                   <FormField control={form.control} name="orderNote" render={({ field }) => (
//                     <FormItem><FormLabel>{t('order_note')}</FormLabel><FormControl><Textarea placeholder={t('order_note')} {...field} /></FormControl></FormItem>
//                   )} />

//                   <div className="pt-4 border-t">
//                     <h3 className="text-lg font-bold mb-4">{t('payment_method')}</h3>
//                     <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
//                       {storeConfig.paymentSettings?.cod_enabled && (
//                         <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-accent/50">
//                           <RadioGroupItem value="Cash On Delivery" id="cod" />
//                           <Label htmlFor="cod" className="flex-grow cursor-pointer">{t('cash_on_delivery')}</Label>
//                         </div>
//                       )}
//                       {storeConfig.paymentSettings?.bkash_enabled && (
//                         <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-accent/50">
//                           <RadioGroupItem value="bKash" id="bkash" />
//                           <Label htmlFor="bkash" className="flex-grow cursor-pointer">bKash (Online)</Label>
//                         </div>
//                       )}
//                     </RadioGroup>
//                   </div>

//                   <div className="pt-4 border-t">
//                     <div className="flex space-x-2">
//                       <Input placeholder={t('coupon_code')} value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value)} />
//                       <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>{t('apply')}</Button>
//                     </div>
//                   </div>

//                   {selectedPaymentMethod === "Cash On Delivery" ? (
//                     <ThemedButton type="submit" className="w-full h-12 text-lg" disabled={isPlacingOrder || cartItems.length === 0}>
//                       {isPlacingOrder ? t('processing') : t('confirm_order')}
//                     </ThemedButton>
//                   ) : (
//                     <div className="space-y-3">
//                       {selectedPaymentMethod === "bKash" && (
//                         <BkashPayment 
//                           amount={finalTotal} 
//                           orderId={incompleteOrderId} 
//                           customerInfo={form.getValues()} 
//                           onPaymentSuccess={(id) => { clearCart(); navigate(getPath("/order-confirmation"), { state: { orderId: id } }); }} 
//                           onPaymentFailure={() => showError(t('payment_failed'))} 
//                         />
//                       )}
//                     </div>
//                   )}
//                 </form>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer 
//         layout={storeConfig?.layout?.footer || {}} 
//         copyrightText={storeConfig?.layout?.footer?.copyrightText || ""} 
//         socialLinks={storeConfig?.layout?.footer?.socialLinks || []} 
//         logoUrl={storeConfig?.storeConfiguration?.logoUrl || ""} 
//         storeName={storeConfig?.storeConfiguration?.storeName || ""} 
//       />
//     </div>
//   );
// };

// export default Checkout;

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { validateCoupon, createIncompleteOrder, updateOrder, fetchCategories, fetchCourierStatus } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useStorePath } from "@/hooks/use-store-path";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Plus, Minus, User, Phone, MapPin, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
  const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { storeConfig, currentCurrency, currencyConversionRate } = useStore();
  const navigate = useNavigate();
  const getPath = useStorePath();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
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
    defaultValues: { firstName: "", phone: "", address: "", division: "", district: "", upazila: "", dhakaZone: "", email: "", orderNote: "" },
  });

  const formValues = form.watch();
  const debouncedFormValues = useDebounce(formValues, 1000);

  const isDhakaCityAreaSelected = debouncedFormValues.division === "Dhaka" && debouncedFormValues.district === "Dhaka City";

  // Financial Calculations
  const finalTotal = useMemo(() => {
    return cartTotal + shippingCost - discountAmount;
  }, [cartTotal, shippingCost, discountAmount]);

  useEffect(() => {
    if (!storeConfig) return;
    const zones = storeConfig?.deliverySettings?.zones || [];
    const match = zones.find(z => z.zone_name === debouncedFormValues.district || z.zone_name === debouncedFormValues.upazila);
    setShippingCost(match ? parseFloat(match.charge) : parseFloat(storeConfig?.deliverySettings?.default_charge || 0));
  }, [debouncedFormValues.district, debouncedFormValues.upazila, storeConfig]);

  // --- UPDATED AUTO-SAVE LOGIC ---
  useEffect(() => {
    const handleAutoSave = async () => {
      if (cartItems.length === 0 || (!debouncedFormValues.firstName && !debouncedFormValues.phone)) return;

      const currentPayload = {
        customer_phone: debouncedFormValues.phone,
        customer_email: debouncedFormValues.email || "customer@example.com",
        shipping_address: { 
          address: debouncedFormValues.address, 
          city: isDhakaCityAreaSelected ? debouncedFormValues.dhakaZone : debouncedFormValues.upazila || debouncedFormValues.district,
          state: debouncedFormValues.district,
          country: "Bangladesh"
        },
        order_items: cartItems.map(item => ({
          product_id: item.id,
          product_name_at_purchase: item.name,
          quantity: item.quantity,
          price_at_purchase: item.price,
          selected_variants: item.selectedVariantOptions || []
        })),
        // Comprehensive money-related info
        subtotal_amount: parseFloat(cartTotal.toFixed(2)),
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        discount_amount: parseFloat(discountAmount.toFixed(2)),
        total_amount: parseFloat(finalTotal.toFixed(2)),
        coupon_code: appliedCoupon?.code || null,
        payment_method: selectedPaymentMethod || "Pending",
        customer_notes: debouncedFormValues.orderNote,
        status: "incomplete"
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
        console.error("Auto-save update failed:", error);
      } finally {
        isSavingRef.current = false;
      }
    };
    handleAutoSave();
  }, [debouncedFormValues, cartItems, shippingCost, discountAmount, finalTotal, appliedCoupon, selectedPaymentMethod, isDhakaCityAreaSelected]);

  const filteredDistricts = useMemo(() => {
    const div = DIVISION_OPTIONS.find(d => d.name === formValues.division);
    return div ? DISTRICT_OPTIONS.filter(d => d.division_id === div.id) : [];
  }, [formValues.division]);

  const filteredUpazilas = useMemo(() => {
    if (isDhakaCityAreaSelected) return [];
    const dist = DISTRICT_OPTIONS.find(d => d.name === formValues.district);
    return dist ? UPAZILA_OPTIONS.filter(u => u.district_id === dist.id) : [];
  }, [formValues.district, isDhakaCityAreaSelected]);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const res = await validateCoupon({ code: couponCodeInput, productIds: cartItems.map(i => i.id) });
      if (res.success) {
        let disc = res.data.discount_type === "percent" ? (cartTotal * parseFloat(res.data.discount_value)) / 100 : parseFloat(res.data.discount_value);
        setAppliedCoupon(res.data);
        setDiscountAmount(Math.min(disc, cartTotal));
        setCouponMessage({ text: t('coupon_applied'), type: "success" });
      } else {
        setCouponMessage({ text: res.message, type: "error" });
      }
    } catch (e) {
      showError(t('error_applying_coupon'));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPaymentMethod) return showError(t('please_select_payment_method'));
    setIsPlacingOrder(true);
    const tid = showLoading(t('placing_order'));
    try {
      const { fraudPrevention } = storeConfig;

      if (fraudPrevention?.enabled) {
        const customerPhoneNumber = data.phone;
        const minSuccessRate = fraudPrevention.customer_order_success_rate;

        if (customerPhoneNumber) {
          const courierStatusResponse = await fetchCourierStatus(customerPhoneNumber);

          if (courierStatusResponse.status === "success" && courierStatusResponse.courierData?.summary?.success_ratio !== undefined) {
            const successRatio = courierStatusResponse.courierData.summary.success_ratio;
            if (successRatio < minSuccessRate) {
              dismissToast(tid);
              showError(t("order_prevented_low_success_ratio", { rate: minSuccessRate }));
              setIsPlacingOrder(false);
              return; // Prevent order placement
            }
          } else {
            console.warn("Failed to fetch courier status or invalid response for fraud prevention.", courierStatusResponse);
            // Optionally, decide whether to prevent order or proceed if courier status check fails
            // For now, we'll proceed but log a warning.
          }
        } else {
          console.warn("Customer phone number missing for fraud prevention check.");
          // Decide if an order should be prevented if phone number is missing for the check.
        }
      }

      const finalData = { 
        ...data, 
        status: selectedPaymentMethod === "Cash On Delivery" ? "completed" : "pending_payment",
        payment_method: selectedPaymentMethod,
        total_amount: finalTotal,
        discount_amount: discountAmount,
        shipping_cost: shippingCost,
        coupon_code: appliedCoupon?.code || null,
        finalize_order: true
      };
      const res = await updateOrder(incompleteOrderIdRef.current, finalData);
      if (res.status === "success") {
        clearCart();
        navigate(getPath("/order-confirmation"), { state: { orderId: incompleteOrderIdRef.current } });
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
      <Header layout={storeConfig.layout} storeName={storeConfig.storeConfiguration.storeName} logoUrl={storeConfig.storeConfiguration.logoUrl} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Detailed Order Summary */}
          <div className="lg:col-start-2">
            <div className="bg-card p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24 border">
              <h2 className="text-2xl font-bold mb-6">{t('order_summary')}</h2>
              <div className="space-y-4 max-h-[450px] overflow-y-auto pt-4 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex  justify-between items-start relative border-b pb-4">
                    <button onClick={() => removeFromCart(item.id)} className="absolute -top-1 -left-1 bg-background rounded-full border p-1 z-10 hover:text-destructive"><X className="h-3 w-3" /></button>
                    <div className="flex items-start space-x-4 ml-4">
                      <div className="relative">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md border" />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm truncate max-w-[150px]">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price, currentCurrency, currencyConversionRate)}</p>
                        <div className="flex items-center mt-2 bg-muted/50 rounded-full border p-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></Button>
                          <span className="px-2 text-xs">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                    <p className="font-bold text-sm">{formatPrice(item.price * item.quantity, currentCurrency, currencyConversionRate)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-sm"><span>{t('subtotal')}</span><span>{formatPrice(cartTotal, currentCurrency, currencyConversionRate)}</span></div>
                <div className="flex justify-between text-sm"><span>{t('shipping')}</span><span>{shippingCost === 0 ? t('free') : formatPrice(shippingCost, currentCurrency, currencyConversionRate)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-sm text-green-600 font-medium"><span>{t('discount')} ({appliedCoupon?.code})</span><span>-{formatPrice(discountAmount, currentCurrency, currencyConversionRate)}</span></div>}
                <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t"><span>{t('total')}</span><span className="text-primary">{formatPrice(finalTotal, currentCurrency, currencyConversionRate)}</span></div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">{t('shipping_information')}</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>{t('your_name')} *</FormLabel><FormControl><InputWithLeadingIcon icon={User} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>{t('phone_number')} *</FormLabel><FormControl><InputWithLeadingIcon icon={Phone} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>{t('your_address')} *</FormLabel><FormControl><InputWithLeadingIcon icon={MapPin} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="division" render={({ field }) => (
                      <FormItem><FormLabel>{t('division')} *</FormLabel><CustomDropdown options={DIVISION_OPTIONS} value={field.value} onChange={field.onChange} placeholder={t('select')} /><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="district" render={({ field }) => (
                      <FormItem><FormLabel>{t('district')} *</FormLabel><CustomDropdown options={filteredDistricts} value={field.value} onChange={field.onChange} placeholder={t('select')} /><FormMessage /></FormItem>
                    )} />
                  </div>

                  {isDhakaCityAreaSelected ? (
                    <FormField control={form.control} name="dhakaZone" render={({ field }) => (
                      <FormItem><FormLabel>{t('zone')} *</FormLabel><CustomDropdown options={DHAKA_ZONE_OPTIONS} value={field.value} onChange={field.onChange} placeholder={t('select_zone')} /><FormMessage /></FormItem>
                    )} />
                  ) : (
                    <FormField control={form.control} name="upazila" render={({ field }) => (
                      <FormItem><FormLabel>{t('upazila')} *</FormLabel><CustomDropdown options={filteredUpazilas} value={field.value} onChange={field.onChange} placeholder={t('select_upazila')} /><FormMessage /></FormItem>
                    )} />
                  )}

                  <FormField control={form.control} name="orderNote" render={({ field }) => (
                    <FormItem><FormLabel>{t('order_note')}</FormLabel><FormControl><Textarea placeholder={t('order_note')} {...field} /></FormControl></FormItem>
                  )} />

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-bold mb-4">{t('payment_method')}</h3>
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                      {storeConfig.paymentSettings?.cod_enabled && (
                        <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-accent/50">
                          <RadioGroupItem value="Cash On Delivery" id="cod" />
                          <Label htmlFor="cod" className="flex-grow cursor-pointer">{t('cash_on_delivery')}</Label>
                        </div>
                      )}
                      {storeConfig.paymentSettings?.bkash_enabled && (
                        <div className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-accent/50">
                          <RadioGroupItem value="bKash" id="bkash" />
                          <Label htmlFor="bkash" className="flex-grow cursor-pointer">bKash (Online)</Label>
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex space-x-2">
                      <Input placeholder={t('coupon_code')} value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value)} />
                      <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>{t('apply')}</Button>
                    </div>
                  </div>

                  {selectedPaymentMethod === "Cash On Delivery" ? (
                    <ThemedButton type="submit" className="w-full h-12 text-lg" disabled={isPlacingOrder || cartItems.length === 0}>
                      {isPlacingOrder ? t('processing') : t('confirm_order')}
                    </ThemedButton>
                  ) : (
                    <div className="space-y-3">
                      {selectedPaymentMethod === "bKash" && (
                        <BkashPayment 
                          amount={finalTotal} 
                          orderId={incompleteOrderId} 
                          customerInfo={form.getValues()} 
                          onPaymentSuccess={(id) => { clearCart(); navigate(getPath("/order-confirmation"), { state: { orderId: id } }); }} 
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
