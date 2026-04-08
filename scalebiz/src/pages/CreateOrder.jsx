"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import CreateOrderHeader from "@/components/orders/CreateOrderHeader.jsx";
import OrderProductsSection from "@/components/orders/OrderProductsSection.jsx";
import OrderSummarySection from "@/components/orders/OrderSummarySection.jsx";
import OrderAddNoteSection from "@/components/orders/OrderAddNoteSection.jsx";
import OrderInformationSection from "@/components/orders/OrderInformationSection.jsx";
import CustomerInformationSection from "@/components/orders/CustomerInformationSection.jsx";
import CustomerValiditySection from "@/components/orders/CustomerValiditySection.jsx";
import AddProductToOrderDialog from "@/components/orders/AddProductToOrderDialog.jsx";
import { showSuccess, showError } from "@/utils/toast.js";
import { useOrders } from "@/hooks/use-orders.js";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { createOrder, isCreating } = useOrders();

  const [orderProducts, setOrderProducts] = React.useState([]);
  const [discountPercentage, setDiscountPercentage] = React.useState(0);
  const [vatTaxPercentage, setVatTaxPercentage] = React.useState(0);
  const [deliveryCharge, setDeliveryCharge] = React.useState(0);
  const [paidAmount, setPaidAmount] = React.useState(0);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = React.useState(false);
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerAddress, setCustomerAddress] = React.useState("");
  const [orderNote, setOrderNote] = React.useState("");
  const [orderType, setOrderType] = React.useState("In shop");
  const [orderStatus, setOrderStatus] = React.useState("Order Completed");

  const handleAddProduct = (product) => {
    setOrderProducts((prev) => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p);
      }
      return [...prev, product];
    });
    showSuccess(`${product.name} added to order!`);
    setIsAddProductDialogOpen(false);
  };

  const handleRemoveProduct = (productId) => {
    setOrderProducts(prev => prev.filter(p => p.id !== productId));
    showError("Product removed from order.");
  };

  const subtotal = orderProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const discountAmount = subtotal * (discountPercentage / 100);
  const grandTotal = subtotal - discountAmount + deliveryCharge;
  const dueAmount = grandTotal - paidAmount;

  const handleCreateOrder = () => {
    if (orderProducts.length === 0) return showError("Please add at least one product.");
    if (!customerPhone) return showError("Customer phone number is required.");

    const payload = {
      customer_email: customerEmail || "unauthenticated.customer@example.com",
      customer_phone: customerPhone,
      shipping_address: { street: customerAddress, city: "", state: "", zip: "", country: "" },
      billing_address: { street: customerAddress, city: "", state: "", zip: "", country: "" },
      shipping_method: "Standard Shipping",
      payment_method: "Cash on Delivery",
      customer_notes: orderNote,
      order_items: orderProducts.map(p => ({ product_id: p.id, quantity: p.quantity })),
    };

    createOrder(payload, {
      onSuccess: () => navigate("/orders"),
    });
  };

  return (
    <div className="p-4 md:p-6">
      <CreateOrderHeader onCreateOrder={handleCreateOrder} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderProductsSection
            orderProducts={orderProducts}
            onAddProductClick={() => setIsAddProductDialogOpen(true)}
            onRemoveProduct={handleRemoveProduct}
          />
          <OrderSummarySection
            discountPercentage={discountPercentage} setDiscountPercentage={setDiscountPercentage}
            vatTaxPercentage={vatTaxPercentage} setVatTaxPercentage={setVatTaxPercentage}
            deliveryCharge={deliveryCharge} setDeliveryCharge={setDeliveryCharge}
            paidAmount={paidAmount} setPaidAmount={setPaidAmount}
            subtotal={subtotal} discountAmount={discountAmount}
            grandTotal={grandTotal} dueAmount={dueAmount}
          />
          <OrderAddNoteSection note={orderNote} setNote={setOrderNote} />
        </div>
        <div className="lg:col-span-1">
          <OrderInformationSection orderType={orderType} setOrderType={setOrderType} orderStatus={orderStatus} setOrderStatus={setOrderStatus} />
          <CustomerInformationSection 
            name={customerName} setName={setCustomerName}
            email={customerEmail} setEmail={setCustomerEmail}
            phone={customerPhone} setPhone={setCustomerPhone}
            address={customerAddress} setAddress={setCustomerAddress}
          />
          <CustomerValiditySection />
        </div>
      </div>
      <AddProductToOrderDialog
        isOpen={isAddProductDialogOpen}
        onClose={() => setIsAddProductDialogOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default CreateOrder;