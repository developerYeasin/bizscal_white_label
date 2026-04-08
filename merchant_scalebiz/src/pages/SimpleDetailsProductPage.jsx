import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProductImageSliderModal from "../components/product-detail/ProductImageSliderModal";
import CustomDropdown from "../components/CustomDropdown";
import { DIVISION_OPTIONS } from "../data/divisions";
import { DISTRICT_OPTIONS } from "../data/districts";
import { UPAZILA_OPTIONS } from "../data/upazilas";
import { DHAKA_ZONE_OPTIONS } from "../data/dhakaZones";
import { useStore } from "@/context/StoreContext.jsx";
import { createOrder, validateCoupon } from "../lib/api"; // Import validateCoupon
import { showSuccess, showError, showLoading, dismissToast } from "../utils/toast";
import InputWithLeadingIcon from "../components/InputWithLeadingIcon";
import { User, Phone, MapPin, Menu, Mail } from "lucide-react"; // Import icons
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const cashOnDeliverySchema = z.object({
  firstName: z.string().min(1, { message: "Name is required." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  division: z.string().min(1, { message: "Division is required." }),
  district: z.string().min(1, { message: "District is required." }),
  upazila: z.string().optional(),
  dhakaZone: z.string().optional(),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .optional()
    .or(z.literal("")),
  orderNote: z.string().optional(),
});

const SimpleDetailsProductPage = ({ data, product: topLevelProduct, onBuyNowClick }) => {
  console.log("SimpleDetailsProductPage received data:", data);
  console.log("SimpleDetailsProductPage received topLevelProduct:", topLevelProduct);
  const { t } = useTranslation();
  const { storeConfig } = useStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });
  const [packageImagesCarouselApi, setPackageImagesCarouselApi] = useState();
  const [customerReviewsCarouselApi, setCustomerReviewsCarouselApi] = useState();

  const openModal = useCallback((images, index) => {
    setModalImages(images);
    setIsModalOpen(true);
    setCurrentImageIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Autoplay for Package Images Carousel
  useEffect(() => {
    if (!packageImagesCarouselApi) {
      return;
    }

    const interval = setInterval(() => {
      packageImagesCarouselApi.scrollNext();
    }, 2000); // Autoplay every 2 seconds

    return () => {
      clearInterval(interval);
    };
  }, [packageImagesCarouselApi]);

  const themeSpecificProductData = data?.product || {};
  const generalSettings = data?.general_settings || {};

  // Autoplay for Customer Reviews Carousel
  useEffect(() => {
    if (!customerReviewsCarouselApi) {
      return;
    }

    const interval = setInterval(() => {
      customerReviewsCarouselApi.scrollNext();
    }, 2000); // Autoplay every 2 seconds

    return () => {
      clearInterval(interval);
    };
  }, [customerReviewsCarouselApi]);

  const product = React.useMemo(() => {
    const mergedProduct = {
      ...topLevelProduct,
      ...themeSpecificProductData,
      packageImages: themeSpecificProductData.packageImages || topLevelProduct?.images?.map(src => ({ src, caption: "" })) || [],
      customerReviews: themeSpecificProductData.customerReviews || [],
      currentPrice: parseFloat(themeSpecificProductData.currentPrice || topLevelProduct?.price || 0).toFixed(2),
      oldPrice: parseFloat(themeSpecificProductData.oldPrice || topLevelProduct?.regularPrice || 0).toFixed(2),
      // Assuming these are needed for direct calculation if storeConfig isn't ready immediately
      deliveryChargeDhaka: themeSpecificProductData.deliveryChargeDhaka || 60,
      deliveryChargeOutsideDhaka: themeSpecificProductData.deliveryChargeDhaka || 120,
    };
    return mergedProduct;
  }, [data, topLevelProduct]);

  // Use useForm for the checkout form
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

  const formValues = form.watch(); // Watch all form fields
  const debouncedFormValues = formValues; // No debounce for simplicity in single page for now

  const selectedDivision = form.watch("division");
  const selectedDistrict = form.watch("district");

  const isDhakaCitySelected = selectedDistrict === "Dhaka City";

  const filteredDistricts = useMemo(() => {
    const div = DIVISION_OPTIONS.find((d) => d.name === selectedDivision);
    return div ? DISTRICT_OPTIONS.filter((d) => d.division_id === div.id) : [];
  }, [selectedDivision]);

  const filteredUpazilas = useMemo(() => {
    if (isDhakaCitySelected) return [];
    const dist = DISTRICT_OPTIONS.find((d) => d.name === selectedDistrict);
    return dist ? UPAZILA_OPTIONS.filter((u) => u.district_id === dist.id) : [];
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

  // Shipping cost calculation based on form selection
  const shippingCost = useMemo(() => {
    if (!storeConfig) return 0; // Default to 0 if storeConfig not loaded
    const zones = storeConfig?.deliverySettings?.zones || [];
    const defaultCharge = parseFloat(storeConfig?.deliverySettings?.default_charge || 0);

    let calculatedCost = defaultCharge;

    if (storeConfig?.deliverySettings?.zones) {
      if (isDhakaCitySelected && debouncedFormValues.dhakaZone) {
        const dhakaZoneMatch = DHAKA_ZONE_OPTIONS.find(
          (zone) => zone.name === debouncedFormValues.dhakaZone,
        );
        if (dhakaZoneMatch) {
          const customZone = zones.find(
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
          const customZone = zones.find(
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
          const customZone = zones.find(
            (z) => z.type === "Upazila/P.S" && z.zone_id === upazilaMatch.id,
          );
          if (customZone) {
            return parseFloat(customZone.charge);
          }
        }
      }
    }

    return calculatedCost;
  }, [debouncedFormValues.division, debouncedFormValues.district, debouncedFormValues.upazila, debouncedFormValues.dhakaZone, storeConfig, isDhakaCitySelected]);

  // Calculate subtotal and total for the single product
  const subtotal = useMemo(() => {
    if (!product) return 0;
    return parseFloat(product.currentPrice);
  }, [product]);

  const total = useMemo(() => {
    return subtotal + shippingCost - discountAmount;
  }, [subtotal, shippingCost, discountAmount]);

  const handleApplyCoupon = async () => {
    setCouponMessage({ text: "", type: "" });
    if (!couponCodeInput.trim()) {
      setCouponMessage({ text: t("please_enter_coupon_code"), type: "error" });
      return;
    }
    setIsApplyingCoupon(true);
    const toastId = showLoading(t("applying"));

    try {
      const res = await validateCoupon({ code: couponCodeInput, productIds: [product.id] });
      if (res.success) {
        let disc = res.data.discount_type === "percent" ? (subtotal * parseFloat(res.data.discount_value)) / 100 : parseFloat(res.data.discount_value);
        setAppliedCoupon(res.data);
        setDiscountAmount(Math.min(disc, subtotal));
        dismissToast(toastId);
        showSuccess(t("coupon_applied_placeholder", { code: couponCodeInput }));
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

  // Main order submission handler (similar to handlePlaceOrder in popup, but simplified for single product direct order)
  const handlePlaceOrder = async (data) => {
    const toastId = showLoading(t("placing_cod_order"));
    try {
      if (!product) {
        showError(t("product_data_not_available"));
        dismissToast(toastId);
        return;
      }

      const orderItems = [
        {
          product_id: product.id,
          product_name_at_purchase: product.name,
          // Assuming no variants are selected on SimpleDetailsProductPage, or handled upstream
          selected_variants: [], 
          quantity: 1, // Always 1 for direct buy on this page
          price_at_purchase: parseFloat(product.currentPrice),
        },
      ];

      const finalOrderData = {
        customer_name: data.firstName,
        customer_email: data.email || "cod_customer@example.com", // Default email if not provided
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
        shipping_method: isDhakaCitySelected
          ? "Inside Dhaka City COD"
          : "Outside Dhaka City COD",
        payment_method: "Cash On Delivery",
        customer_notes: data.orderNote || "Direct order via SimpleDetailsProductPage.",
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        tax_amount: 0, // Assuming 0 tax for now
        discount_amount: parseFloat(discountAmount.toFixed(2)),
        total_amount: parseFloat(total.toFixed(2)),
        order_items: orderItems,
        customer_ip_address: "127.0.0.1", // Placeholder
        user_agent: navigator.userAgent, // Placeholder
        utm_source: "dyad-app-simple-product-page", // Custom UTM source
        coupon_code: appliedCoupon?.code || null,
        status: "pending", // Initial status after submission
        finalize_order: true, // Mark as final order
      };

      const orderResponse = await createOrder(finalOrderData); // Use createOrder directly

      if (orderResponse.status === "success") {
        showSuccess(t("cod_order_placed_successfully"));
        navigate(`/order-confirmation`, { state: { orderId: orderResponse.data.order_id } });
      } else {
        showError(orderResponse.message || t("failed_to_place_cod_order"));
      }
    } catch (error) {
      console.error("SimpleDetailsProductPage Order placement error:", error);
      showError(t("unexpected_error_placing_order"));
    } finally {
      dismissToast(toastId);
    }
  };

  if (!product) {
    return <div className="text-center py-10">{t("product_data_not_available_short")}</div>;
  }

  console.log("Debug: product object in SimpleDetailsProductPage", product);

  return (
    <div className=" sm:max-w-[90%] w-full mx-auto sm:px-4 py-6 space-y-8 bg-slate-50 text-slate-900">
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap");
          body {
              font-family: "Hind Siliguri", sans-serif;
              scroll-behavior: smooth;
          }
          .animate-pulse-slow {
              animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .8; }
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
          {product.name} <br />
          <span className="text-[#0b8a44]">
            {t("only_price_taka", { price: product.currentPrice })}
          </span>
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
              {t("current_price")}
            </p>
            <p className="text-3xl font-black text-rose-600">
              ৳{product.currentPrice}
            </p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 md:block hidden"></div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
              {t("old_price")}
            </p>
            <p className="text-xl font-medium text-slate-400 line-through">
              ৳{product.oldPrice}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {t("stock_limited_order_now")}
        </div>
      </section>

      {/* Delivery Badge */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div className="bg-slate-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#0b8a44]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        </div>
        <div className="text-sm">
          <p className="font-bold text-slate-700">{t("delivery_charge")}</p>
          <p className="text-slate-500">
            {/* Dynamically display shipping cost */}
            ৳{shippingCost.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Video Presentation */}
      {product.videoUrl && (
        <section className="space-y-3">
          <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={product.videoUrl}
              title="Product Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-center text-xs font-medium text-slate-500 uppercase tracking-widest">
            {t("watch_video_how_to_use")}
          </p>
        </section>
      )}

      {/* Order Form Card */}
      <section
        id="order-form"
        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
          <h3 className="text-center text-lg font-bold text-slate-800">
            {t("fill_order_form")}
          </h3>
        </div>

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
                      {t("your_name")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithLeadingIcon
                        icon={User}
                        placeholder={t("full_name_placeholder")}
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
                      {t("mobile_number")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithLeadingIcon
                        icon={Phone}
                        placeholder={t("mobile_placeholder")}
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
                      {t("your_address")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithLeadingIcon
                        icon={MapPin}
                        placeholder={t("address_placeholder")}
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
                      {t("division")} <span className="text-red-500">*</span>
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
                        {t("district")} <span className="text-red-500">*</span>
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
                        {t("dhaka_zone")} <span className="text-red-500">*</span>
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
                        {t("upazila")} <span className="text-red-500">*</span>
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

            {/* Coupon Code - simplified for single product page */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3
                className="text-lg font-bold"
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
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  {isApplyingCoupon ? t("applying") : t("apply")}
                </button>
              </div>
              {couponMessage.text && (
                <p
                  className={`text-sm mt-2 ${couponMessage.type === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {couponMessage.text}
                </p>
              )}
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

            {/* Confirm Your Order (Cash On Delivery) Summary */}
            <div className="bg-green-50 text-green-800 rounded-2xl p-5 border border-dashed border-green-300 mt-8">
              <h4 className="text-lg font-bold mb-4">{t("confirm_your_order_cod")}</h4>
              <div className="flex justify-between items-center text-sm mb-2">
                <span>{t("product_name")}: {product.name}</span>
                <span className="font-bold">
                  ৳{parseFloat(product.currentPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span>{t("delivery_charge")}:</span>
                <span className="font-bold">
                  ৳{shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>{t("payment_method")}:</span>
                <span className="font-bold">
                  {t("cash_on_delivery_full")}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-green-200">
                <span>{t("total")}:</span>
                <span className="text-xl">
                  ৳{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final Action Button */}
            <button
              type="submit"
              className="w-full bg-[#0b8a44] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#097339] transition-all shadow-[0_10px_20px_-10px_rgba(11,138,68,0.5)] active:scale-[0.98]"
            >
              {t("confirm_order")}
            </button>
            <p className="text-center text-red-600 text-sm font-medium">
              {t("order_confirm_warning")}
            </p>
          </form>
        </Form>
      </section>

      {/* Product Grid (Package Images) */}
      <section className="space-y-6">
        <h3 className="text-center text-xl font-bold text-slate-800 relative">
          {t("what_you_get_in_package")}
          <span className="block h-1 w-12 bg-[#0b8a44] mx-auto mt-2 rounded-full"></span>
        </h3>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setPackageImagesCarouselApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {product.packageImages.map((image, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div
                  className="group bg-white rounded-3xl p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => openModal(product.packageImages.map(img => img.src), index)}
                >
                  <div className="overflow-hidden rounded-2xl mb-3 aspect-square bg-slate-50">
                    <img
                      src={image.src}
                      alt={image.caption || `Item ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center font-bold text-slate-700 text-sm">
                    {image.caption || `Item ${index + 1}`}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Product Description HTML */}
      {product.descriptionHtml && (
        <section className="mt-8 px-4">
          <h3 className="text-2xl font-bold mb-4">{t("product_description")}</h3>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </section>
      )}

      {/* Package Contents */}
      {product.packageContents && product.packageContents.length > 0 && (
        <section className="mt-8 px-4">
          <h3 className="text-2xl font-bold mb-4">{t("package_contents")}</h3>
          <ul className="list-disc list-inside space-y-1">
            {product.packageContents.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Customer Trust / Reviews */}
      {product.customerReviews &&
        product.customerReviews.filter(Boolean).length > 0 && (
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-center text-xl font-bold text-slate-800">
              {t("our_customer_reviews")}
            </h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setCustomerReviewsCarouselApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {product.customerReviews
                  .filter(Boolean)
                  .map((reviewImg, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <div
                        className="shadow-sm border border-slate-100 rounded-2xl p-3 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => openModal(product.customerReviews.filter(Boolean), index)}
                      >
                        <img
                          src={reviewImg}
                          className="w-full rounded-2xl"
                          alt={`Review ${index + 1}`}
                        />
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

      {/* Bottom CTA */}
      <section className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 md:hidden">
        <a
          href="#order-form"
          className="flex items-center justify-center gap-2 bg-[#0b8a44] text-white py-4 rounded-full font-bold shadow-2xl animate-pulse-slow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997 1 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          {t("click_to_order")}
        </a>
      </section>

      {isModalOpen && (
        <ProductImageSliderModal
          images={modalImages}
          initialSlideIndex={currentImageIndex}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SimpleDetailsProductPage;
