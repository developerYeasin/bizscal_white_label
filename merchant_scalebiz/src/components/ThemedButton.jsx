import React from "react";
import { useStore } from "@/context/StoreContext.jsx";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ThemedButton = React.forwardRef(({ className, variant, style, ...props }, ref) => {
  const { storeConfig } = useStore();

  // Determine the variant from the theme, fallback to 'default' (solid)
  const themeVariant = storeConfig?.theme.buttonStyle.style === 'outline' ? 'outline' : 'default';

  return (
    <Button
      className={cn(className)}
      ref={ref}
      variant={variant || themeVariant} // Use the passed variant prop if it exists, otherwise use the theme's variant
      style={style}
      {...props}
    />
  );
});

ThemedButton.displayName = "ThemedButton";

export default ThemedButton;