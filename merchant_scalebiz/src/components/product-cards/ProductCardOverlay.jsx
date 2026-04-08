import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ThemedButton from "@/components/ThemedButton";
import { useCart } from "@/context/CartContext";
import { showSuccess } from "@/utils/toast";
import { Plus } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer"; // Import CountdownTimer
import { useStorePath } from "@/hooks/use-store-path"; // Import useStorePath
import { useTranslation } from "react-i18next";
import { cn, formatPrice } from "@/lib/utils"; // Import formatPrice
import { useStore } from "@/context/StoreContext"; // Import useStore

const ProductCardOverlay = ({ product, buttonStyle, showBuyNowButton, onQuickViewClick }) => { // Changed onBuyViewClick to onQuickViewClick
  const { t } = useTranslation(); // Initialize useTranslation
  const { addToCart } = useCart();
  const getPath = useStorePath(); // Initialize useStorePath
  const { currentCurrency, currencyConversionRate } = useStore(); // Use currency context

  const hasOptions = (product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    if (product.isStockOut) return; // Prevent action if out of stock
    const priceToUse = product.price; // Determine the correct price
    if (hasOptions) {
      onQuickViewClick(e, product); // Open quick view if options exist
    } else {
      addToCart(product, 1, priceToUse); // Pass the price
      showSuccess(`${product.name} ${t('added_to_cart')}!`);
    }
  };

  const hasSalePrice = product.salePrice && product.salePrice < product.price;


  return (
    <Card className="group relative w-full rounded-lg overflow-hidden shadow-lg h-[450px]">
      <Link to={getPath(`/products/${product.id}`)} className="absolute inset-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg font-semibold text-white line-clamp-2" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
            {product.name}
          </h3>
          <div className="flex items-baseline space-x-2"> {/* Added flex container */}
            {hasSalePrice && (
              <p className="text-sm text-white/70 line-through">
                {formatPrice(product.regularPrice, currentCurrency, currencyConversionRate)}
              </p>
            )}
            <p className="text-md font-bold text-white/90">
              {formatPrice(product.price, currentCurrency, currencyConversionRate)}
            </p>
          </div>
        </div>

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

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-2">
          {/* <ThemedButton
            onClick={handleAddToCart}
            size="icon"
            style={buttonStyle}
          >
            <Plus className="h-5 w-5" />
          </ThemedButton> */}
          {showBuyNowButton && (
            <ThemedButton
              onClick={(e) => onQuickViewClick(e, product)} // Use onQuickViewClick for Buy Now
              size="icon"
              className="bg-[var(--dynamic-accent-color)] hover:brightness-110 text-[var(--dynamic-secondary-color)]"
              disabled={product.isStockOut}
            >
              {t('buy')}
            </ThemedButton>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default ProductCardOverlay;