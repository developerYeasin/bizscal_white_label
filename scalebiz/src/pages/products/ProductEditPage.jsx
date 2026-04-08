"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductFormHeader from "@/components/products/ProductFormHeader.jsx";
import ProductGeneralInformation from "@/components/products/ProductGeneralInformation.jsx";
import ProductMedia from "@/components/products/ProductMedia.jsx";
import ProductPricing from "@/components/products/ProductPricing.jsx";
import ProductInventory from "@/components/products/ProductInventory.jsx";
import ProductShipping from "@/components/products/ProductShipping.jsx";
import ProductVariants from "@/components/products/ProductVariants.jsx";
import ProductDetails from "@/components/products/ProductDetails.jsx";
import ProductSidebar from "@/components/products/ProductSidebar.jsx";
import { useProductById, useProducts } from "@/hooks/use-products.js";
import { useCategories } from "@/hooks/use-categories.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";

const ProductEditPage = () => {
  const { productId } = useParams();
  const id = productId ? parseInt(productId) : null;
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProductById(id);
  const { updateProduct, isUpdating: isSaving } = useProducts();
  const { categories: allCategories, isLoading: categoriesLoading } = useCategories();

  // State for all form fields
  const [itemName, setItemName] = React.useState("");
  const [shortDescription, setShortDescription] = React.useState("");
  const [productDescription, setProductDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [hoverImageUrl, setHoverImageUrl] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [sellPrice, setSellPrice] = React.useState("");
  const [regularPrice, setRegularPrice] = React.useState("");
  const [buyingPrice, setBuyingPrice] = React.useState("");
  const [productSerial, setProductSerial] = React.useState("");
  const [skuCode, setSkuCode] = React.useState("");
  const [unitName, setUnitName] = React.useState("");
  const [quantityStock, setQuantityStock] = React.useState("");
  const [warranty, setWarranty] = React.useState("");
  const [initialSoldCount, setInitialSoldCount] = React.useState("");
  const [applyDefaultDeliveryCharges, setApplyDefaultDeliveryCharges] = React.useState(true);
  const [variants, setVariants] = React.useState([]);
  const [details, setDetails] = React.useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState([]);
  const [brandName, setBrandName] = React.useState("");
  const [condition, setCondition] = React.useState("new");
  const [productStatus, setProductStatus] = React.useState("draft");

  React.useEffect(() => {
    if (product) {
      setItemName(product.name || "");
      setShortDescription(product.short_description || "");
      setProductDescription(product.description || "");
      setImageUrl(product.image_url || "");
      setHoverImageUrl(product.hover_image_url || "");
      setVideoUrl(product.video_url || "");
      setSellPrice(String(product.price || ""));
      setRegularPrice(String(product.regular_price || ""));
      setBuyingPrice(String(product.cost_price || ""));
      setProductSerial(product.barcode || "0");
      setSkuCode(product.sku || "");
      setUnitName(product.unit_name || "");
      setQuantityStock(String(product.stock_quantity || ""));
      setWarranty(product.warranty || "");
      setInitialSoldCount(String(product.initial_sold_count || "0"));
      // setApplyDefaultDeliveryCharges(product.apply_default_delivery_charges); // Assuming this field exists
      setVariants(product.variants || []);
      setDetails(product.details || []);
      setSelectedCategoryIds(product.categories?.map(cat => String(cat.id)) || []);
      // setBrandName(product.brand?.name || ""); // Assuming brand is an object
      setCondition(product.condition || "new");
      setProductStatus(product.status || "draft");
    }
  }, [product]);

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      navigate(`/products/${id}`);
    }
  };

  const handleSave = () => {
    if (!itemName || !sellPrice || !quantityStock) {
      showError("Item Name, Sell/Current Price, and Quantity (Stock) are required.");
      return;
    }

    const payload = {
      id: id,
      name: itemName,
      description: productDescription,
      slug: itemName.toLowerCase().replace(/\s+/g, '-'),
      status: productStatus,
      product_type: "simple",
      price: parseFloat(sellPrice),
      regular_price: regularPrice ? parseFloat(regularPrice) : null,
      cost_price: buyingPrice ? parseFloat(buyingPrice) : null,
      image_url: imageUrl || null,
      hover_image_url: hoverImageUrl || null,
      video_url: videoUrl || null,
      stock_quantity: parseInt(quantityStock),
      track_inventory: 1,
      condition: condition,
      brand_id: brandName ? 1 : null, // Dummy brand_id
      sku: skuCode || null,
      barcode: productSerial || null,
      category_ids: selectedCategoryIds.map(Number),
      variants: variants,
      details: details,
    };

    updateProduct(payload, {
      onSuccess: () => {
        navigate(`/products/${id}`);
      },
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading product for editing...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Error loading product: {error.message}
        <Button asChild className="mt-4 ml-4"><Link to="/products">Back to Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ProductFormHeader
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={isSaving}
        productId={id} // Pass the current product ID
        isEditMode={true} // In edit mode
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

export default ProductEditPage;