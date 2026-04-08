import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";

const ProductCardMinimal = ({ product, buttonStyle }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  return (
    <Card className="group w-full rounded-lg overflow-hidden border-none shadow-none hover:shadow-[0px_5px_14px_0px_#11111130] transition-shadow bg-transparent h-[450px] flex flex-col text-center">
      <Link to={`/products/${product.id}`} className="block mb-4">

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

        {/* <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover rounded-md"
        /> */}
      </Link>
      <CardContent className="p-2 flex-grow">
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-md font-medium text-foreground hover:text-dynamic-primary-color transition-colors"
            style={{ fontFamily: `var(--dynamic-heading-font)` }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-semibold text-muted-foreground mt-1">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <ThemedButton
          onClick={handleAddToCart}
          className="w-full"
          style={buttonStyle}
        >
          Add to Cart
        </ThemedButton>
      </CardFooter>
    </Card>
  );
};

export default ProductCardMinimal;
