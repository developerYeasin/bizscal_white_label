import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import CountdownTimer from "@/components/CountdownTimer"; // Import CountdownTimer
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { cn, formatPrice } from "@/lib/utils"; // Import cn for conditional classnames, formatPrice
import { useTranslation } from "react-i18next";
import { useStore } from "@/context/StoreContext"; // Import useStore
import { Star } from "lucide-react"; // Import Star icon

const ProductCardMinimal = ({
  product,
  buttonStyle,
  showBuyNowButton,
  onQuickViewClick, // New prop
}) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath(); // Initialize useStorePath
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  const hasOptions = (product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0);

  const handleAddToCart = (e) => {
    if (product.isStockOut) return; // Prevent action if out of stock
    const priceToUse = product.price; // Determine the correct price
    if (hasOptions) {
      onQuickViewClick(e, product); // Open quick view if options exist
    } else {
      addToCart(product, 1, priceToUse); // Pass the price
      showSuccess(`${product.name} ${t('added_to_cart')}!`);
    }
  };

  const hasHoverImage = !!product.hoverImageUrl;
  const hasSalePrice = product.salePrice && product.salePrice < product.price;


  // Static star rating for now, as product data doesn't include ratings
  const renderStars = (filledCount = 0) => { // Default to 0 if no rating
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < filledCount
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          )}
        />
      );
    }
    return <div className="flex justify-center space-x-0.5">{stars}</div>;
  };

  return (
    <Card className="group relative w-full rounded-md overflow-hidden shadow-none border-none  transition-shadow hover:shadow-[0px_5px_14px_0px_#11111130] bg-transparent h-[450px] flex flex-col text-center">
      <Link
        to={getPath(`/products/${product.id}`)}
        className="block relative overflow-hidden flex-grow"
      >
        <div className="relative w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
              hasHoverImage ? "opacity-100 group-hover:opacity-0" : "group-hover:scale-105 transition-transform duration-300"
            )}
          />
          {hasHoverImage && (
            <img
              src={product.hoverImageUrl}
              alt={`${product.name} hover`}
              className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
            />
          )}
          {product.offerCountDown && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <CountdownTimer targetDate={product.offerCountDown} />
            </div>
          )}
          {product.isStockOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold uppercase z-20">
              {t('out_of_stock')}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-2 flex-shrink-0">
        <Link to={getPath(`/products/${product.id}`)}>
          <h3
            className="text-md font-medium text-foreground hover:text-dynamic-primary-color transition-colors line-clamp-2"
            style={{ fontFamily: `var(--dynamic-heading-font)` }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline justify-start space-x-2 mt-1">
          {hasSalePrice && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.regularPrice, currentCurrency, currencyConversionRate)}
            </p>
          )}
          <p className="text-lg font-semibold text-muted-foreground">
            {formatPrice(product.price, currentCurrency, currencyConversionRate)}
          </p>
        </div>
        {/* {renderStars(product.rating)}
        <p className="text-sm text-muted-foreground mt-1">
          ({product.reviewCount} {t('reviews')})
        </p> */}
        <div className="flex flex-col space-y-2">
          <ThemedButton
            onClick={handleAddToCart}
            className="w-full"
            style={buttonStyle}
            disabled={product.isStockOut}
          >
            {product.isStockOut ? t('out_of_stock') : hasOptions ? t("select_options") : t("add_to_cart")}
          </ThemedButton>
          {showBuyNowButton && (
            <ThemedButton
              onClick={(e) => onQuickViewClick(e, product)} // Use onQuickViewClick for Buy Now
              className="w-full"
              style={{ backgroundColor: 'var(--dynamic-accent-color)', color: 'var(--dynamic-secondary-color)' }}
              disabled={product.isStockOut}
            >
              {t("buy_now")}
            </ThemedButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardMinimal;