import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price, currency, conversionRate) {
  // console.log("formatPrice - Input: price=", price, "currency=", currency, "conversionRate=", conversionRate);

  let displayPrice = parseFloat(price); // Ensure it's a number from the start
  if (isNaN(displayPrice)) {
    displayPrice = 0; // Fallback to 0 if it's NaN
  }
  let currencySymbol = "Tk"; // Default symbol for BDT

  if (currency === "USD") {
    displayPrice = displayPrice / conversionRate; // Convert from BDT to USD
    currencySymbol = "$";
  } else { // Assume BDT
    // No conversion needed if the base price is already in BDT
    currencySymbol = "Tk";
  }
  const formattedPrice = `${currencySymbol} ${displayPrice.toFixed(2)}`;
  // console.log("formatPrice - Output:", formattedPrice);
  return formattedPrice;
}

export function getNumericPriceForGTM(priceInBDT, targetCurrency, conversionRate) {
  if (targetCurrency === "USD") {
    return (priceInBDT / conversionRate);
  }
  return priceInBDT; // Assume BDT if not USD
}

export function formatDate(dateString, formatType = 'long') {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  if (formatType === 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
}