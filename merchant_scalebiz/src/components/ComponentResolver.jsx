import React, { lazy, Suspense } from "react";

// Dynamically import components
const HeroBanner = lazy(() => import("./HeroBanner"));
const ProductCarousel = lazy(() => import("./ProductCarousel")); // Existing
const FeaturedCategories = lazy(() => import("./FeaturedCategories")); // Existing
const HeroSlider = lazy(() => import("./HeroSlider")); // Existing
const MarketingBanner = lazy(() => import("./MarketingBanner.jsx")); // New
const FeatureBlocks = lazy(() => import("./FeatureBlocks.jsx")); // New
const ProductSection = lazy(() => import("./ProductSection.jsx")); // New (replaces ProductCarousel for some uses)
const BrandShowcase = lazy(() => import("./BrandShowcase.jsx")); // New
const LatestNews = lazy(() => import("./LatestNews.jsx")); // New
const CategorySidebar = lazy(() => import("./CategorySidebar.jsx")); // Re-added for dynamic resolution
const AllProductsSection = lazy(() => import("./AllProductsSection.jsx")); // New: AllProductsSection

// Diamond Theme Components
const PromotionalBanners = lazy(() =>
  import("./DiamondTheme/PromotionalBanners.jsx")
);
const MidPageCallToAction = lazy(() =>
  import("./DiamondTheme/MidPageCallToAction.jsx")
);
const NewsletterSubscription = lazy(() =>
  import("./DiamondTheme/NewsletterSubscription.jsx")
);
const BlogPostsSection = lazy(() =>
  import("./DiamondTheme/BlogPostsSection.jsx")
);

// Product Landing Page Template Components
const NirvanaTemplate = lazy(() =>
  import("./ProductLandingPage/NirvanaTemplate.jsx")
);
const ArcadiaTemplate = lazy(() =>
  import("./ProductLandingPage/ArcadiaTemplate.jsx")
);
const ProductHeroSectionOne = lazy(() =>
  import("./ProductLandingPage/ProductHeroSectionOne.jsx")
);
const ProductBrandLogos = lazy(() =>
  import("./ProductLandingPage/ProductBrandLogos.jsx")
);
const ProductShowcaseSection = lazy(() =>
  import("./ProductLandingPage/ProductShowcaseSection.jsx")
);
const ProductFeatureBlocksOne = lazy(() =>
  import("./ProductLandingPage/ProductFeatureBlocksOne.jsx")
);
const CustomerTestimonialsOne = lazy(() =>
  import("./ProductLandingPage/CustomerTestimonialsOne.jsx")
);
const NewsletterSectionOne = lazy(() =>
  import("./ProductLandingPage/NewsletterSectionOne.jsx")
);
const NirvanaHeroSection = lazy(() =>
  import("./ProductLandingPage/NirvanaHeroSection.jsx")
);
const NirvanaWhyChooseUs = lazy(() =>
  import("./ProductLandingPage/NirvanaWhyChooseUs.jsx")
);
const NirvanaAboutUs = lazy(() =>
  import("./ProductLandingPage/NirvanaAboutUs.jsx")
);
const NirvanaProductShowcase = lazy(() =>
  import("./ProductLandingPage/NirvanaProductShowcase.jsx")
);
const NirvanaWhyWeAreBest = lazy(() =>
  import("./ProductLandingPage/NirvanaWhyWeAreBest.jsx")
);
const NirvanaTestimonials = lazy(() =>
  import("./ProductLandingPage/NirvanaTestimonials.jsx")
);
const NirvanaNewsletter = lazy(() =>
  import("./ProductLandingPage/NirvanaNewsletter.jsx")
);

// New components for single product page
const CountdownTimer = lazy(() => import("./CountdownTimer.jsx"));
const SimpleDetailsProductPage = lazy(() =>
  import("../pages/SimpleDetailsProductPage.jsx")
);

// Layout Blocks
const Section = lazy(() => import("./LayoutBlocks/Section"));
const Container = lazy(() => import("./LayoutBlocks/Container"));
const Columns = lazy(() => import("./LayoutBlocks/Columns"));
const Grid = lazy(() => import("./LayoutBlocks/Grid"));

const componentMap = {
  heroBanner: HeroBanner,
  productCarousel: ProductCarousel,
  featuredCategories: FeaturedCategories,
  heroBannerSlider: HeroSlider,
  marketingBanner: MarketingBanner,
  featureBlocks: FeatureBlocks,
  productSection: ProductSection,
  brandShowcase: BrandShowcase,
  latestNews: LatestNews,
  categorySidebar: CategorySidebar,
  allProducts: AllProductsSection, // New: AllProductsSection
  promotionalBanners: PromotionalBanners,
  midPageCallToAction: MidPageCallToAction,
  newsletterSubscription: NewsletterSubscription,
  blogPostsSection: BlogPostsSection,
  nirvanaTemplate: NirvanaTemplate,
  arcadiaTemplate: ArcadiaTemplate,
  // single landing product page components
  productHeroSectionOne: ProductHeroSectionOne,
  productBrandLogos: ProductBrandLogos,
  productShowcaseSection: ProductShowcaseSection,
  productFeatureBlocksOne: ProductFeatureBlocksOne,
  customerTestimonialsOne: CustomerTestimonialsOne,
  newsletterSectionOne: NewsletterSectionOne,
  nirvanaHeroSection: NirvanaHeroSection,
  nirvanaWhyChooseUs: NirvanaWhyChooseUs,
  nirvanaAboutUs: NirvanaAboutUs,
  nirvanaProductShowcase: NirvanaProductShowcase,
  nirvanaWhyWeAreBest: NirvanaWhyWeAreBest,
  nirvanaTestimonials: NirvanaTestimonials,
  nirvanaNewsletter: NirvanaNewsletter,
  timerSetting: CountdownTimer,
  simpleDetailsTheme: SimpleDetailsProductPage,
  // Layout Blocks
  section: Section,
  container: Container,
  columns: Columns,
  grid: Grid,
};

const ComponentResolver = ({ type, data, product, onBuyNowClick, nextProductId, prevProductId }) => {
  // Added product and onBuyNowClick
  const Component = componentMap[type];

  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  // Extract cardType if available in data for product-related components
  const productCardStyle =
    type === "productCarousel" ||
    type === "productSection" ||
    type === "allProducts"
      ? data?.cardType
      : undefined; // Added allProductsSection

  return (
    <Suspense
      fallback={
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="text-gray-400">Loading {type}...</p>
        </div>
      }
    >
      <Component
        data={data}
        productCardStyle={productCardStyle}
        product={product} // Pass product prop
        onBuyNowClick={onBuyNowClick} // Pass onBuyNowClick prop
        nextProductId={nextProductId} // Pass next product ID
        prevProductId={prevProductId} // Pass previous product ID
      />
    </Suspense>
  );
};

export default ComponentResolver;