import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";

const SophifyProductCard = ({ product, buttonStyle }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="group w-full rounded-none overflow-hidden border-none shadow-none hover:shadow-[0px_5px_14px_0px_#11111130] transition-shadow bg-transparent h-[300px] flex flex-col text-center">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover transition-opacity  ease-in-out opacity-100 group-hover:opacity-0"
          />
          {product.hoverImageUrl && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="w-full h-80 object-cover absolute top-0 left-0 transition-opacity ease-in-out opacity-0 group-hover:opacity-100"
            />
          )}
        </div>
        <CardContent className="p-2 flex-grow">
          <h3
            className="text-md text-start font-medium text-foreground hover:text-dynamic-primary-color transition-colors"
            style={{ fontFamily: `var(--dynamic-heading-font)` }}
          >
            {product.name}
          </h3>
          <p className="text-lg text-start font-semibold text-muted-foreground">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SophifyProductCard;
