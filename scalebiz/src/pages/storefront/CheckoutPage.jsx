"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart.js";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { ChevronLeft, ChevronRight, CreditCard, Truck } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast.js";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartSubtotal, clearCart } = useCart();
  const { config: storeConfig } = useStoreConfig();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: storeConfig.country || "Bangladesh",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shippingCosts = {
    standard: 50,
    express: 150,
  };

  const shippingCost = shippingCosts[shippingMethod] || 0;
  const taxRate = 0; // TODO: pull from store configuration
  const taxAmount = cartSubtotal * taxRate;
  const totalAmount = cartSubtotal + shippingCost + taxAmount;

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      showError("Please fill in all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(customerInfo.email)) {
      showError("Please enter a valid email address.");
      return;
    }
    setStep(2);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zip) {
      showError("Please fill in all required shipping fields.");
      return;
    }
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create incomplete order first
      const orderData = {
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: `${shippingAddress.address}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}`,
        billing_address: `${shippingAddress.address}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}`,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          selected_variants: item.selected_variants || {},
          price_at_purchase: item.price_at_purchase,
        })),
      };

      // Step 1: Create incomplete order
      const createResponse = await fetch("http://localhost:3001/api/v1/orders/incomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No auth required for this endpoint
        },
        body: JSON.stringify(orderData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const { data } = await createResponse.json();
      const orderId = data.order.id;

      // Step 2: Update order to finalize (could add payment processing here)
      // For now, we'll just update status
      await fetch(`http://localhost:3001/api/v1/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
          payment_status: "pending",
        }),
      });

      setOrderId(orderId);
      await clearCart();
      setStep(4); // Success step
      showSuccess("Order placed successfully!");
    } catch (error) {
      showError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate('/products')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
        Checkout
      </h1>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center mb-8">
        {["Information", "Shipping", "Payment", "Review"].map((label, idx) => (
          <React.Fragment key={label}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > idx + 1
                    ? "bg-primary text-primary-foreground"
                    : step === idx + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > idx + 1 ? "✓" : idx + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:inline">{label}</span>
            </div>
            {idx < 3 && <div className="w-12 h-px bg-border mx-2" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">
                      Continue to Shipping
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Street (optional)</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Division *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip">ZIP/Postal Code *</Label>
                      <Input
                        id="zip"
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit">
                      Continue to Payment
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: "standard", name: "Standard Shipping", desc: "3-5 business days", cost: 50 },
                      { id: "express", name: "Express Shipping", desc: "1-2 business days", cost: 150 },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          shippingMethod === method.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setShippingMethod(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                          </div>
                          <div className="font-medium">${method.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: "cod", name: "Cash on Delivery", desc: "Pay when you receive" },
                      { id: "bkash", name: "bKash", desc: "Mobile payment" },
                      { id: "nagad", name: "Nagad", desc: "Mobile payment" },
                      { id: "card", name: "Credit/Debit Card", desc: "SSLCommerz" },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === method.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mb-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-muted-foreground mb-4">
                    Thank you for your order. Your order ID is: <strong>{orderId}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    We'll send you an email with order details and tracking information.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
                  <Button variant="outline" onClick={() => navigate('/')}>Go to Home</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartSubtotal?.toFixed(2) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
