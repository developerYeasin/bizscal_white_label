"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Link } from "react-router-dom";
import ThemedButton from "../ThemedButton.jsx";
import { ShoppingCart } from "lucide-react";

const MultiViewProductCard = ({ product, themeConfig }) => {
  if (!product) return null;

  const primaryColor = themeConfig?.primary_color || 'var(--dynamic-primary-color)';
  const [currentImage, setCurrentImage] = React.useState(product.image_url);

  React.useEffect(() => {
    setCurrentImage(product.image_url);
  }, [product.image_url]);

  const handleMouseEnter = () => {
    if (product.hover_image_url) {
      setCurrentImage(product.hover_image_url);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(product.image_url);
  };

  return (
    <Card className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/products/${product.id}`}>
        <img
          src={currentImage || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-semibold mb-1 text-foreground group-hover:text-[${primaryColor}] transition-colors" style={{ color: primaryColor }}>
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {product.categories && product.categories.length > 0 ? product.categories[0].name : "Uncategorized"}
          </p>
          <p className="text-xl font-bold" style={{ color: primaryColor }}>
            ৳ {parseFloat(product.price).toFixed(2)}
          </p>
        </CardContent>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ThemedButton className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
        </ThemedButton>
      </div>
    </Card>
  );
};

export default MultiViewProductCard;