"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Pencil, Image as ImageIcon, LayoutTemplate, Eye } from "lucide-react";
import { useProductById } from "@/hooks/use-products.js";
import { Badge } from "@/components/ui/badge.jsx";

const ProductViewPage = () => {
  const { productId } = useParams();
  const id = productId ? parseInt(productId) : null;
  const { data: product, isLoading, error } = useProductById(id);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-center text-destructive">
        <p>Error: {error.message}</p>
        <Button asChild className="mt-4">
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p>Product not found.</p>
        <Button asChild className="mt-4">
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Product Details: {product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/single-product-pages/view/${product.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Landing Page
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/single-product-pages/edit/${product.id}`}>
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Landing Page Settings
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                <p className="text-lg font-semibold">{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-base">{product.description || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="text-base">{product.sku || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                  <p className="text-base">{product.barcode || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-lg font-semibold">৳ {parseFloat(product.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regular Price</p>
                <p className="text-base">{product.regular_price ? `৳ ${parseFloat(product.regular_price).toFixed(2)}` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                <p className="text-base">{product.cost_price ? `৳ ${parseFloat(product.cost_price).toFixed(2)}` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Quantity</p>
                <p className="text-base">{product.stock_quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Track Inventory</p>
                <p className="text-base">{product.track_inventory ? "Yes" : "No"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.image_url && (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Main Image</p>
                  <img src={product.image_url} alt={product.name} className="w-full max-w-xs h-auto object-cover rounded-md border" />
                </div>
              )}
              {product.hover_image_url && (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Hover Image</p>
                  <img src={product.hover_image_url} alt={`${product.name} Hover`} className="w-full max-w-xs h-auto object-cover rounded-md border" />
                </div>
              )}
              {!product.image_url && !product.hover_image_url && (
                <div className="col-span-full text-center text-muted-foreground flex flex-col items-center justify-center h-24 border rounded-md">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  No images available.
                </div>
              )}
              {product.video_url && (
                <div className="col-span-full">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Video Link</p>
                  <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {product.video_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map(cat => (
                      <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                    ))
                  ) : (
                    <p className="text-base">N/A</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand</p>
                <p className="text-base">{product.brand_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Condition</p>
                <p className="text-base">{product.condition || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Type</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product Status</p>
                <Badge variant="default" className="capitalize">{product.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product Type</p>
                <p className="text-base capitalize">{product.product_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-base capitalize">{product.gender || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-base">{new Date(product.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-base">{new Date(product.updated_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;