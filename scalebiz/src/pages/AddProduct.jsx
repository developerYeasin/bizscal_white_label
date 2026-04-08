"use client";

import React from "react";
import ProductFormHeader from "@/components/products/ProductFormHeader.jsx";
import ProductGeneralInformation from "@/components/products/ProductGeneralInformation.jsx";
import ProductMedia from "@/components/products/ProductMedia.jsx";
import ProductPricing from "@/components/products/ProductPricing.jsx";
import ProductInventory from "@/components/products/ProductInventory.jsx";
import ProductShipping from "@/components/products/ProductShipping.jsx";
import ProductVariants from "@/components/products/ProductVariants.jsx";
import ProductDetails from "@/components/products/ProductDetails.jsx";
import ProductSidebar from "@/components/products/ProductSidebar.jsx";
import { useProducts } from "@/hooks/use-products.js";
import { useCategories } from "@/hooks/use-categories.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct, isLoading: isSaving } = useProducts();
  const { categories: allCategories, isLoading: categoriesLoading } = useCategories();

  // General Information
  const [itemName, setItemName] = React.useState("");
  const [shortDescription, setShortDescription] = React.useState("");
  const [productDescription, setProductDescription] = React.useState("");

  // Media
  const [imageUrl, setImageUrl] = React.useState("");
  const [hoverImageUrl, setHoverImageUrl] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");

  // Pricing
  const [sellPrice, setSellPrice] = React.useState("");
  const [regularPrice, setRegularPrice] = React.useState("");
  const [buyingPrice, setBuyingPrice] = React.useState("");

  // Inventory
  const [productSerial, setProductSerial] = React.useState("0");
  const [skuCode, setSkuCode] = React.useState("");
  const [unitName, setUnitName] = React.useState("");
  const [quantityStock, setQuantityStock] = React.useState("");
  const [warranty, setWarranty] = React.useState("");
  const [initialSoldCount, setInitialSoldCount] = React.useState("0");

  // Shipping
  const [applyDefaultDeliveryCharges, setApplyDefaultDeliveryCharges] = React.useState(true);

  // Variants
  const [variants, setVariants] = React.useState([]);

  // Details
  const [details, setDetails] = React.useState([]);

  // Sidebar
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState([]);
  const [brandName, setBrandName] = React.useState("");
  const [condition, setCondition] = React.useState("new");
  const [productStatus, setProductStatus] = React.useState("draft");

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      // Reset all form fields
      setItemName("");
      setShortDescription("");
      setProductDescription("");
      setImageUrl("");
      setHoverImageUrl("");
      setVideoUrl("");
      setSellPrice("");
      setRegularPrice("");
      setBuyingPrice("");
      setProductSerial("0");
      setSkuCode("");
      setUnitName("");
      setQuantityStock("");
      setWarranty("");
      setInitialSoldCount("0");
      setApplyDefaultDeliveryCharges(true);
      setVariants([]);
      setDetails([]);
      setSelectedCategoryIds([]);
      setBrandName("");
      setCondition("new");
      setProductStatus("draft");
      showSuccess("Product creation discarded.");
      navigate("/products"); // Navigate back to product list
    }
  };

  const handleSave = () => {
    if (!itemName || !sellPrice || !quantityStock) {
      showError("Item Name, Sell/Current Price, and Quantity (Stock) are required.");
      return;
    }

    const payload = {
      name: itemName,
      description: productDescription,
      slug: itemName.toLowerCase().replace(/\s+/g, '-'), // Simple slug generation
      status: productStatus,
      product_type: "simple", // Assuming simple for now
      price: parseFloat(sellPrice),
      regular_price: regularPrice ? parseFloat(regularPrice) : null,
      cost_price: buyingPrice ? parseFloat(buyingPrice) : null,
      image_url: imageUrl || null,
      hover_image_url: hoverImageUrl || null,
      video_url: videoUrl || null,
      stock_quantity: parseInt(quantityStock),
      track_inventory: 1, // Assuming inventory is always tracked for now
      condition: condition,
      brand_id: brandName ? 1 : null, // Dummy brand_id, replace with actual brand ID lookup
      sku: skuCode || null,
      barcode: productSerial || null, // Using productSerial as barcode for now
      category_ids: selectedCategoryIds.map(Number),
      variants: variants,
      details: details,
    };

    createProduct(payload, {
      onSuccess: () => {
        showSuccess("Product created successfully!");
        navigate("/products"); // Navigate back to product list
      },
      onError: (err) => {
        showError(err.message || "Failed to create product.");
      },
    });
  };

  return (
    <div className="p-4 md:p-6">
      <ProductFormHeader
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
        productId={null} // No product ID for add page
        isEditMode={false} // Not in edit mode
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductGeneralInformation
            itemName={itemName}
            setItemName={setItemName}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
          />
          <ProductMedia
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            hoverImageUrl={hoverImageUrl}
            setHoverImageUrl={setHoverImageUrl}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
          />
          <ProductPricing
            sellPrice={sellPrice}
            setSellPrice={setSellPrice}
            regularPrice={regularPrice}
            setRegularPrice={setRegularPrice}
            buyingPrice={buyingPrice}
            setBuyingPrice={setBuyingPrice}
          />
          <ProductInventory
            productSerial={productSerial}
            setProductSerial={setProductSerial}
            skuCode={skuCode}
            setSkuCode={setSkuCode}
            unitName={unitName}
            setUnitName={setUnitName}
            quantityStock={quantityStock}
            setQuantityStock={setQuantityStock}
            warranty={warranty}
            setWarranty={setWarranty}
            initialSoldCount={initialSoldCount}
            setInitialSoldCount={setInitialSoldCount}
          />
          <ProductShipping
            applyDefaultDeliveryCharges={applyDefaultDeliveryCharges}
            setApplyDefaultDeliveryCharges={setApplyDefaultDeliveryCharges}
          />
          <ProductVariants variants={variants} setVariants={setVariants} />
          <ProductDetails details={details} setDetails={setDetails} />
        </div>
        <div className="lg:col-span-1">
          <ProductSidebar
            selectedCategoryIds={selectedCategoryIds}
            setSelectedCategoryIds={setSelectedCategoryIds}
            brandName={brandName}
            setBrandName={setBrandName}
            condition={condition}
            setCondition={setCondition}
            productStatus={productStatus}
            setProductStatus={setProductStatus}
            allCategories={allCategories}
            categoriesLoading={categoriesLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;