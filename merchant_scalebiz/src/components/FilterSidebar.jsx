import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GENDER_OPTIONS, PRODUCT_TYPE_OPTIONS, PRICE_RANGE_DEFAULTS } from "@/data/filterOptions";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ onFilterChange, initialFilters }) => {
  const { t } = useTranslation();
  // Initialize local states from initialFilters or defaults
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories || []);
  const [selectedGender, setSelectedGender] = useState(initialFilters.gender || "");
  // Use initialFilters.priceRange if available, otherwise PRICE_RANGE_DEFAULTS
  const initialPriceRange = initialFilters.priceRange || PRICE_RANGE_DEFAULTS;
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [minPriceInput, setMinPriceInput] = useState(initialPriceRange[0]);
  const [maxPriceInput, setMaxPriceInput] = useState(initialPriceRange[1]);
  const [selectedProductTypes, setSelectedProductTypes] = useState(initialFilters.productTypes || []);

  // Fetch categories dynamically
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['filterCategories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Effect to update local state when initialFilters prop changes (e.g., when collectionId changes)
  useEffect(() => {
    // Only update if the incoming prop is different from current local state
    if (JSON.stringify(selectedCategories) !== JSON.stringify(initialFilters.categories || [])) {
      setSelectedCategories(initialFilters.categories || []);
    }
    if (selectedGender !== (initialFilters.gender || "")) {
      setSelectedGender(initialFilters.gender || "");
    }
    // Special handling for priceRange: if initialFilters.priceRange is undefined, reset to defaults
    // If it's defined, use it.
    const newInitialPriceRange = initialFilters.priceRange || PRICE_RANGE_DEFAULTS;
    if (JSON.stringify(priceRange) !== JSON.stringify(newInitialPriceRange)) {
      setPriceRange(newInitialPriceRange);
      setMinPriceInput(newInitialPriceRange[0]);
      setMaxPriceInput(newInitialPriceRange[1]);
    }
    if (JSON.stringify(selectedProductTypes) !== JSON.stringify(initialFilters.productTypes || [])) {
      setSelectedProductTypes(initialFilters.productTypes || []);
    }
  }, [initialFilters]); // Depend on initialFilters object reference

  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked ? [...selectedCategories, categoryId] : selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(newCategories);
    // Apply filter immediately
    onFilterChange({
      categories: newCategories,
      gender: selectedGender,
      priceRange: priceRange,
      productTypes: selectedProductTypes,
    });
  };

  const handleGenderChange = (genderId) => {
    setSelectedGender(genderId);
    // Apply filter immediately
    onFilterChange({
      categories: selectedCategories,
      gender: genderId,
      priceRange: priceRange,
      productTypes: selectedProductTypes,
    });
  };

  const handleProductTypeChange = (typeId, checked) => {
    const newProductTypes = checked ? [...selectedProductTypes, typeId] : selectedProductTypes.filter((id) => id !== typeId);
    setSelectedProductTypes(newProductTypes);
    // Apply filter immediately
    onFilterChange({
      categories: selectedCategories,
      gender: selectedGender,
      priceRange: priceRange,
      productTypes: newProductTypes,
    });
  };

  const handleMinPriceBlur = () => {
    let newMin = Number(minPriceInput);
    let newMax = Number(maxPriceInput);

    // Ensure min is not greater than max, and values are within overall defaults
    newMin = Math.max(PRICE_RANGE_DEFAULTS[0], Math.min(newMin, newMax));
    newMax = Math.min(PRICE_RANGE_DEFAULTS[1], Math.max(newMax, newMin)); // Ensure max is also clamped relative to newMin

    const newPriceRange = [newMin, newMax];
    setPriceRange(newPriceRange);
    setMinPriceInput(newMin); // Update input state to reflect clamped value
    setMaxPriceInput(newMax); // Update input state to reflect clamped value
    
    console.log("handleMinPriceBlur called. newPriceRange:", newPriceRange);
    onFilterChange({
      categories: selectedCategories,
      gender: selectedGender,
      priceRange: newPriceRange,
      productTypes: selectedProductTypes,
    });
  };

  const handleMaxPriceBlur = () => {
    let newMin = Number(minPriceInput);
    let newMax = Number(maxPriceInput);

    // Ensure max is not less than min, and values are within overall defaults
    newMax = Math.min(PRICE_RANGE_DEFAULTS[1], Math.max(newMax, newMin));
    newMin = Math.max(PRICE_RANGE_DEFAULTS[0], Math.min(newMin, newMax)); // Ensure min is also clamped relative to newMax

    const newPriceRange = [newMin, newMax];
    setPriceRange(newPriceRange);
    setMinPriceInput(newMin); // Update input state to reflect clamped value
    setMaxPriceInput(newMax); // Update input state to reflect clamped value
    
    console.log("handleMaxPriceBlur called. newPriceRange:", newPriceRange);
    onFilterChange({
      categories: selectedCategories,
      gender: selectedGender,
      priceRange: newPriceRange,
      productTypes: selectedProductTypes,
    });
  };

  const handlePriceSliderChange = (value) => {
    console.log("Slider value changed:", value); // Debug log
    setPriceRange(value);
    setMinPriceInput(value[0]);
    setMaxPriceInput(value[1]);
  };

  const handlePriceSliderCommit = (value) => {
    // Apply filter on commit
    onFilterChange({
      categories: selectedCategories,
      gender: selectedGender,
      priceRange: value,
      productTypes: selectedProductTypes,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedGender("");
    setPriceRange(PRICE_RANGE_DEFAULTS);
    setMinPriceInput(PRICE_RANGE_DEFAULTS[0]);
    setMaxPriceInput(PRICE_RANGE_DEFAULTS[1]);
    setSelectedProductTypes([]);
    // Also clear filters in parent
    onFilterChange({
      categories: [],
      gender: "",
      priceRange: undefined, // Send undefined to clear price filter
      productTypes: [],
    });
  };

  return (
    <aside className="md:sticky md:top-24">
      <div className="w-full p-4 border rounded-lg bg-card max-h-[calc(100vh-7rem)] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
          {t('filters')}
        </h2>

        <Accordion type="multiple" defaultValue={["category", "gender", "price", "product-type"]} className="w-full">
          {/* Category Filter */}
          <AccordionItem value="category">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">{t('category')}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {isLoadingCategories ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                ))
              ) : categoriesError ? (
                <p className="text-destructive">{t('error_loading_categories')}</p>
              ) : (
                categories?.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="cursor-pointer">{category.name}</Label>
                  </div>
                ))
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Gender Filter */}
          <AccordionItem value="gender">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">{t('gender')}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <RadioGroup onValueChange={handleGenderChange} value={selectedGender}>
                {GENDER_OPTIONS.map((gender) => (
                  <div key={gender.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={gender.id} id={`gender-${gender.id}`} />
                    <Label htmlFor={`gender-${gender.id}`} className="cursor-pointer">{gender.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range Filter */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">{t('price_range')}</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <Slider
                min={PRICE_RANGE_DEFAULTS[0]}
                max={PRICE_RANGE_DEFAULTS[1]}
                step={1}
                value={priceRange}
                onValueChange={handlePriceSliderChange}
                onValueCommit={handlePriceSliderCommit}
                className="w-[90%] mx-auto"
              />
              <div className="flex justify-between items-center space-x-2">
                <Input
                  type="number"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(Number(e.target.value))} // Update local state immediately
                  onBlur={handleMinPriceBlur} // Apply filter on blur
                  className="w-1/2 border-2 border-primary"
                  min={PRICE_RANGE_DEFAULTS[0]}
                  max={maxPriceInput}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(Number(e.target.value))} // Update local state immediately
                  onBlur={handleMaxPriceBlur} // Apply filter on blur
                  className="w-1/2 border-2 border-primary"
                  min={minPriceInput}
                  max={PRICE_RANGE_DEFAULTS[1]}
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Product Type Filter */}
          <AccordionItem value="product-type">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">{t('product_type')}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {PRODUCT_TYPE_OPTIONS.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={selectedProductTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleProductTypeChange(type.id, checked)}
                  />
                  <Label htmlFor={`type-${type.id}`} className="cursor-pointer">{type.name}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="w-full mt-6"
          >
            {t('clear_filters')}
          </Button>
        </div>
      </aside>
    );
  };

export default FilterSidebar;