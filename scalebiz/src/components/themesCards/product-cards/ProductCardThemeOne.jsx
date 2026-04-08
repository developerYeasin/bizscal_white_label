import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess, showError } from "@/utils/toast";
import { Star, Heart, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductCardThemeOne = ({ product, buttonStyle }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    // In a real app, this would likely open a product options modal
    showError("Please select options for this product.");
  };

  const showComingSoon = (e) => {
    e.preventDefault(); // Prevent link navigation
    showSuccess("This feature is coming soon!");
  };

  // Static star rating for now, as product data doesn't include ratings
  const renderStars = (filledCount = 4) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < filledCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      );
    }
    return <div className="flex justify-center space-x-0.5">{stars}</div>;
  };

  return (
    <Card className="group relative w-full rounded-none overflow-hidden shadow-none border-none bg-transparent h-[450px] flex flex-col text-center hover:shadow-[0px_5px_14px_0px_#11111130] transition-shadow">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden flex-grow">
        {/* "NEW" Badge */}
        <span className="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
          New
        </span>

        {/* Product Images */}
        <div className="relative w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
          />
          {product.hoverImageUrl && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
            />
          )}
        </div>

        {/* Hover Overlay with Icons and Button */}
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2 mb-4">
            <ThemedButton size="icon" onClick={showComingSoon} className="bg-white text-dynamic-primary-color hover:bg-gray-100">
              <RefreshCw className="h-4 w-4" />
            </ThemedButton>
            <ThemedButton size="icon" onClick={showComingSoon} className="bg-white text-dynamic-primary-color hover:bg-gray-100">
              <Search className="h-4 w-4" />
            </ThemedButton>
            <ThemedButton size="icon" onClick={showComingSoon} className="bg-white text-dynamic-primary-color hover:bg-gray-100">
              <Heart className="h-4 w-4" />
            </ThemedButton>
          </div>
          <ThemedButton
            onClick={handleAddToCart}
            className="px-6 py-2 text-sm"
            style={buttonStyle}
          >
            Select Options
          </ThemedButton>
        </div>
      </Link>

      <CardContent className="p-4 pt-2 flex-shrink-0">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-1 text-foreground hover:text-dynamic-primary-color transition-colors" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2">
          {product.category || "Shop"} {/* Assuming product has a category or default to "Shop" */}
        </p>
        {renderStars()}
        <p className="text-xl font-bold text-dynamic-primary-color mt-2">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCardThemeOne;