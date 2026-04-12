# Merchant ScaleBiz Pages & Components Analysis

## Overview
This document provides a comprehensive analysis of all pages in the `merchant_scalebiz` project and their components, mapped against the `scalebiz/src/pages/builder/Builder.jsx` structure for dynamic page creation.

---

## 1. Pages Overview

### 1.1 Index.jsx (Home Page)
**Purpose:** Main landing page with dynamic components

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ComponentResolver` - Dynamic component rendering
- `AllProductsSection` - Product listing section
- `CategorySidebar` - Category navigation sidebar
- `MadeWithMaxbles` - Attribution component

**Block Types Mapped to Builder:**
- `heroBannerSlider` - Hero banner carousel
- `productSection` - Product carousel/section
- `featuredCategories` - Category showcase
- `categorySidebar` - Sidebar navigation
- `marketingBanner` - Promotional banners
- `featureBlocks` - Feature highlights
- `brandShowcase` - Brand logos
- `latestNews` - News/blog section
- `promotionalBanners` - Mid-page banners
- `midPageCallToAction` - CTA sections
- `newsletterSubscription` - Newsletter signup
- `blogPostsSection` - Blog posts grid

---

### 1.2 ProductDetail.jsx (Product Detail Page)
**Purpose:** Individual product display with purchase options

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `Breadcrumb` - Navigation breadcrumbs
- `ProductImageGallery` - Product image gallery with zoom
- `ProductInfo` - Product details (price, variants, add to cart)
- `ProductPolicyBlocks` - Policy information blocks
- `ProductFeaturedSection` - Featured product section
- `ProductDescriptionTabs` - Tabbed product description
- `ProductRelatedCarousel` - Related products carousel
- `RightColumnBanner` - Right sidebar banner

**Block Types Mapped to Builder:**
- `heroBanner` - Product hero section
- `productSection` - Product details
- `featureBlocks` - Feature highlights
- `promotionalBanners` - Promotional content
- `customerTestimonials` - Reviews/testimonials
- `brandShowcase` - Brand information
- `newsletterSubscription` - Newsletter signup

---

### 1.3 Collection.jsx (Category/Collections Page)
**Purpose:** Product listing by category with filtering

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `FilterSidebar` - Product filtering sidebar
- `ProductCardResolver` - Dynamic product card rendering
- `ThemedButton` - Theme-aware buttons
- `Skeleton` - Loading placeholders

**Block Types Mapped to Builder:**
- `heroBanner` - Category hero section
- `productSection` - Product grid/listing
- `featuredCategories` - Category navigation
- `promotionalBanners` - Promotional content
- `featureBlocks` - Feature highlights

---

### 1.4 ProductLandingPage.jsx (Product Landing Page)
**Purpose:** Custom landing pages for specific products

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ComponentResolver` - Dynamic component rendering
- `ProductLandingPageBuyForm` - Purchase form
- `CashOnDeliveryPopup` - COD payment popup

**Template Components (Arcadia):**
- `ProductHeroSectionOne` - Hero section
- `ProductBrandLogos` - Brand logos
- `ProductShowcaseSection` - Product showcase
- `ProductFeatureBlocksOne` - Feature blocks
- `CustomerTestimonialsOne` - Testimonials
- `NewsletterSectionOne` - Newsletter signup
- `MinimalProductLandingPageFooter` - Minimal footer

**Template Components (Nirvana):**
- `NirvanaHeroSection` - Hero section
- `NirvanaWhyChooseUs` - Why choose us section
- `NirvanaAboutUs` - About us section
- `NirvanaProductShowcase` - Product showcase
- `NirvanaWhyWeAreBest` - Why we're best section
- `NirvanaTestimonials` - Testimonials
- `NirvanaNewsletter` - Newsletter signup
- `NirvanaMinimalFooter` - Minimal footer

**Block Types Mapped to Builder:**
- `heroBannerSlider` - Hero carousel
- `productSection` - Product showcase
- `featureBlocks` - Feature highlights
- `brandShowcase` - Brand logos
- `customerTestimonials` - Testimonials
- `newsletterSubscription` - Newsletter signup

---

### 1.5 Contact.jsx (Contact Page)
**Purpose:** Contact form and information

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ContactForm` - Contact form component

**Block Types Mapped to Builder:**
- `heroBanner` - Page header
- `contactForm` - Contact form
- `featureBlocks` - Contact information
- `promotionalBanners` - Promotional content

---

### 1.6 PolicyPage.jsx (Policy Pages)
**Purpose:** Display policy content (Privacy, Terms, etc.)

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `Link` - Navigation links
- `Breadcrumb` - Navigation breadcrumbs

**Block Types Mapped to Builder:**
- `heroBanner` - Page header
- `text` - Rich text content
- `title` - Page title
- `description` - Page description

---

### 1.7 DynamicPageRenderer.jsx (Custom Pages)
**Purpose:** Render custom pages from page builder

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ComponentResolver` - Dynamic component rendering
- `Breadcrumb` - Navigation breadcrumbs
- `Button` - Action buttons
- `Skeleton` - Loading placeholders

**Block Types Mapped to Builder:**
- All theme blocks from `ComponentResolver`
- `systemHeader` - System header
- `systemFooter` - System footer

---

### 1.8 Cart.jsx (Shopping Cart)
**Purpose:** Shopping cart management

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ThemedButton` - Theme-aware buttons
- `Button` - Action buttons
- `Input` - Quantity input
- `Label` - Form labels
- `Trash2`, `Plus`, `Minus` - Icons

**Block Types Mapped to Builder:**
- `heroBanner` - Cart header
- `featureBlocks` - Cart items
- `promotionalBanners` - Promotional content
- `midPageCallToAction` - Checkout CTA

---

### 1.9 Checkout.jsx (Checkout Page)
**Purpose:** Order checkout with payment

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ThemedButton` - Theme-aware buttons
- `Input` - Form inputs
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` - Form components
- `CustomModal` - Modal dialogs
- `CustomDropdown` - Dropdown selects
- `RadioGroup`, `RadioGroupItem` - Radio buttons
- `Textarea` - Text areas
- `InputWithLeadingIcon` - Icon inputs
- `BkashPayment` - Bkash payment component
- `Plus`, `Minus`, `User`, `Phone`, `MapPin`, `X` - Icons

**Block Types Mapped to Builder:**
- `heroBanner` - Checkout header
- `featureBlocks` - Order summary
- `promotionalBanners` - Promotional content
- `newsletterSubscription` - Newsletter signup

---

### 1.10 OrderConfirmation.jsx (Order Confirmation)
**Purpose:** Order confirmation and invoice generation

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ThemedButton` - Theme-aware buttons
- `Link` - Navigation links

**Block Types Mapped to Builder:**
- `heroBanner` - Confirmation header
- `featureBlocks` - Order details
- `promotionalBanners` - Promotional content
- `newsletterSubscription` - Newsletter signup

---

### 1.11 ReceiptPage.jsx (Order Receipt)
**Purpose:** Display order receipt details

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ThemedButton` - Theme-aware buttons

**Block Types Mapped to Builder:**
- `heroBanner` - Receipt header
- `featureBlocks` - Order details
- `promotionalBanners` - Promotional content

---

### 1.12 SimpleDetailsProductPage.jsx (Simple Product Page)
**Purpose:** Simplified product detail page

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ComponentResolver` - Dynamic component rendering

**Block Types Mapped to Builder:**
- `heroBanner` - Product hero
- `productSection` - Product details
- `featureBlocks` - Feature highlights
- `promotionalBanners` - Promotional content

---

### 1.13 NotFound.jsx (404 Page)
**Purpose:** Handle 404 errors

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social

**Block Types Mapped to Builder:**
- `heroBanner` - 404 hero
- `text` - Error message
- `button` - Return to home button

---

### 1.14 OldCheckout.jsx (Legacy Checkout)
**Purpose:** Legacy checkout page (deprecated)

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social

**Block Types Mapped to Builder:**
- Same as Checkout.jsx

---

### 1.15 DynamicPageRenderer.jsx (Custom Pages)
**Purpose:** Render custom pages from page builder

**Components Used:**
- `Header` - Navigation header
- `Footer` - Footer with links and social
- `ComponentResolver` - Dynamic component rendering
- `Breadcrumb` - Navigation breadcrumbs
- `Button` - Action buttons
- `Skeleton` - Loading placeholders

**Block Types Mapped to Builder:**
- All theme blocks from `ComponentResolver`
- `systemHeader` - System header
- `systemFooter` - System footer

---

## 2. Builder.jsx Component Analysis

### 2.1 Settings Components (Right Sidebar)

**Hero & Product Blocks:**
- `HeroBannerSettings` - Hero banner configuration
- `ProductCarouselSettings` - Product carousel configuration
- `FeaturedCategoriesSettings` - Featured categories configuration
- `HeroBannerSliderSection` - Hero slider settings
- `MarketingBannerSettings` - Marketing banner settings
- `FeatureBlocksSettings` - Feature blocks settings
- `ProductSectionSettings` - Product section settings
- `BrandShowcaseSettings` - Brand showcase settings
- `LatestNewsSettings` - Latest news settings
- `CategorySidebarSettings` - Category sidebar settings
- `PromotionalBannersSettings` - Promotional banners settings
- `MidPageCallToActionSettings` - Mid-page CTA settings
- `NewsletterSubscriptionSettings` - Newsletter settings
- `BlogPostsSectionSettings` - Blog posts settings

**System Blocks:**
- `SystemHeaderSettings` - Header configuration
- `SystemFooterSettings` - Footer configuration

**Layout Blocks:**
- `SectionBlockSettings` - Section settings
- `RowBlockSettings` - Row settings
- `ColumnBlockSettings` - Column settings
- `GridBlockSettings` - Grid settings

**Basic Blocks:**
- `TitleBlockSettings` - Title settings
- `DescriptionBlockSettings` - Description settings
- `TextBlockSettings` - Text settings
- `ButtonBlockSettings` - Button settings
- `ImageBlockSettings` - Image settings

---

## 3. Component Mapping Summary

### 3.1 Core Layout Components (Required)
| Component | Builder.jsx Status | Notes |
|-----------|-------------------|-------|
| `Header` | ✅ Imported | Used in all pages |
| `Footer` | ✅ Imported | Used in all pages |
| `ComponentResolver` | ✅ Imported | Dynamic component rendering |
| `Breadcrumb` | ✅ Imported | Navigation breadcrumbs |

### 3.2 Theme Block Components (Required)
| Component | Builder.jsx Status | Notes |
|-----------|-------------------|-------|
| `HeroBannerSliderSection` | ✅ Imported | Hero slider |
| `ProductCarousel` | ✅ Imported | Product carousel |
| `FeaturedCategories` | ✅ Imported | Category showcase |
| `MarketingBanner` | ✅ Imported | Marketing banner |
| `FeatureBlocks` | ✅ Imported | Feature highlights |
| `ProductSection` | ✅ Imported | Product section |
| `BrandShowcase` | ✅ Imported | Brand logos |
| `LatestNews` | ✅ Imported | News section |
| `CategorySidebar` | ✅ Imported | Category sidebar |
| `PromotionalBanners` | ✅ Imported | Promotional banners |
| `MidPageCallToAction` | ✅ Imported | CTA section |
| `NewsletterSubscription` | ✅ Imported | Newsletter signup |
| `BlogPostsSection` | ✅ Imported | Blog posts |

### 3.3 Product Page Components (Required)
| Component | Builder.jsx Status | Notes |
|-----------|-------------------|-------|
| `ProductImageGallery` | ❌ Missing | Product image gallery |
| `ProductInfo` | ❌ Missing | Product details |
| `ProductPolicyBlocks` | ❌ Missing | Policy blocks |
| `ProductFeaturedSection` | ❌ Missing | Featured section |
| `ProductDescriptionTabs` | ❌ Missing | Description tabs |
| `ProductRelatedCarousel` | ❌ Missing | Related products |
| `RightColumnBanner` | ❌ Missing | Right sidebar banner |

### 3.4 Cart & Checkout Components (Required)
| Component | Builder.jsx Status | Notes |
|-----------|-------------------|-------|
| `CartContext` | ✅ Available | Cart state management |
| `ThemedButton` | ❌ Missing | Theme-aware buttons |
| `FilterSidebar` | ❌ Missing | Product filtering |
| `ProductCardResolver` | ❌ Missing | Product card rendering |
| `BkashPayment` | ❌ Missing | Bkash payment |
| `CashOnDeliveryPopup` | ❌ Missing | COD popup |
| `CustomModal` | ❌ Missing | Modal dialogs |
| `CustomDropdown` | ❌ Missing | Dropdown selects |

### 3.5 Form Components (Required)
| Component | Builder.jsx Status | Notes |
|-----------|-------------------|-------|
| `ContactForm` | ❌ Missing | Contact form |
| `CheckoutForm` | ❌ Missing | Checkout form |
| `InputWithLeadingIcon` | ❌ Missing | Icon inputs |

---

## 4. Recommendations for Builder.jsx Integration

### 4.1 Missing Components to Add

1. **Product Page Components:**
   - `ProductImageGallery` - For product detail pages
   - `ProductInfo` - For product details
   - `ProductPolicyBlocks` - For policy information
   - `ProductDescriptionTabs` - For tabbed descriptions
   - `ProductRelatedCarousel` - For related products

2. **Cart & Checkout Components:**
   - `CartPage` - For cart management
   - `CheckoutPage` - For checkout process
   - `OrderConfirmation` - For order confirmation
   - `ReceiptPage` - For order receipts

3. **Form Components:**
   - `ContactForm` - For contact pages
   - `PolicyPage` - For policy content

4. **Utility Components:**
   - `ThemedButton` - For theme-aware buttons
   - `FilterSidebar` - For product filtering
   - `ProductCardResolver` - For product cards
   - `CustomModal` - For modal dialogs
   - `CustomDropdown` - For dropdown selects

### 4.2 Settings Components to Add

1. **Product Block Settings:**
   - `ProductGallerySettings` - Product gallery configuration
   - `ProductInfoSettings` - Product info settings
   - `ProductTabsSettings` - Product tabs settings
   - `RelatedProductsSettings` - Related products settings

2. **Cart & Checkout Settings:**
   - `CartSettings` - Cart page settings
   - `CheckoutSettings` - Checkout page settings
   - `PaymentSettings` - Payment method settings

3. **Form Settings:**
   - `ContactFormSettings` - Contact form settings
   - `PolicyPageSettings` - Policy page settings

---

## 5. Conclusion

The `Builder.jsx` already has a solid foundation with most theme block components and settings. To fully support all merchant_scalebiz pages, the following additions are needed:

1. **Product Page Components** - For product detail pages
2. **Cart & Checkout Components** - For e-commerce functionality
3. **Form Components** - For contact and policy pages
4. **Settings Components** - For configuring the above components

All existing pages in merchant_scalebiz can be recreated using the Builder.jsx with these additional components.
