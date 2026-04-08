import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import { Plus } from "lucide-react";

const ProductCardOverlay = ({ product, buttonStyle }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    addToCart(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  return (
    <Card className="group relative w-full rounded-lg overflow-hidden shadow-lg h-[450px]">
      <Link to={`/products/${product.id}`} className="absolute inset-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg font-semibold text-white" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {product.name}
          </h3>
          <p className="text-md font-bold text-white/90">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ThemedButton
            onClick={handleAddToCart}
            size="icon"
            style={buttonStyle}
          >
            <Plus className="h-5 w-5" />
          </ThemedButton>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCardOverlay;