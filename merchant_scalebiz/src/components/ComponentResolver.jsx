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

const DynamicHeader = lazy(() => import("./DynamicBlocks/DynamicHeader"));
const DynamicFooter = lazy(() => import("./DynamicBlocks/DynamicFooter"));

// Card Layout
const CardLayout = lazy(() => import("./page-builder/CardLayout"));
// Card Component
const Card = lazy(() => import("./page-builder/Card"));
// Hero Section
const HeroSection = lazy(() => import("./page-builder/HeroSection"));
// Ready Made Sections
const ReadyMadeSection = lazy(() => import("./page-builder/ReadyMadeSection"));

// Layout Blocks
const Section = lazy(() => import("./LayoutBlocks/Section"));
const Container = lazy(() => import("./LayoutBlocks/Container"));
const Columns = lazy(() => import("./LayoutBlocks/Columns"));
const Grid = lazy(() => import("./LayoutBlocks/Grid"));
const Row = lazy(() => import("./LayoutBlocks/Row"));
const Column = lazy(() => import("./LayoutBlocks/Column"));

// Basic Blocks
const Title = lazy(() => import("./BasicBlocks/Title"));
const Description = lazy(() => import("./BasicBlocks/Description"));

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
  // Diamond Theme Blocks - use ReadyMadeSection with appropriate section type
  newsletterCouponBanner: ReadyMadeSection,
  // Akira Theme Blocks - use ReadyMadeSection with appropriate section type
  promotionalBannerGrid: ReadyMadeSection,
  saleBanner: ReadyMadeSection,
  featuresTrustBadges: ReadyMadeSection,
  // Axon Theme Blocks - use ReadyMadeSection with appropriate section type
  announcementBar: ReadyMadeSection,
  productTabsFilter: ReadyMadeSection,
  // Ghorer Bazar Theme Blocks - use ReadyMadeSection with appropriate section type
  contactInfoBar: ReadyMadeSection,
  heroBannerWithProduct: ReadyMadeSection,
  // Product Landing Page Template Components
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
  row: Row,
  column: Column,
  cardLayout: CardLayout,
  card: Card,
  readyMadeSection: ReadyMadeSection,
  heroSection: HeroSection,
  // Basic Blocks
  title: Title,
  description: Description,
  // System blocks
  systemHeader: DynamicHeader,
  systemFooter: DynamicFooter,
};

const ComponentResolver = ({
  type,
  data,
  children,
  product,
  onBuyNowClick,
  nextProductId,
  prevProductId,
  ...props
}) => {
  // Added children and props for recursion
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
      : undefined;

  // Resolve nested children from either the children prop or from data (columns, rows, etc.)
  const nestedChildren = children || data?.children || data?.columns || data?.rows || [];

  return (
    <Suspense
      fallback={
        <div className="min-h-[10px] flex items-center justify-center">
          <p className="text-gray-400 text-xs">Loading {type}...</p>
        </div>
      }
    >
      <Component
        data={data}
        productCardStyle={productCardStyle}
        product={product}
        onBuyNowClick={onBuyNowClick}
        nextProductId={nextProductId}
        prevProductId={prevProductId}
        {...props}
      >
        {Array.isArray(nestedChildren) &&
          nestedChildren.map((child, index) => (
            <ComponentResolver
              key={child.id || index}
              type={child.type}
              data={child.data}
              children={child.children}
              product={product}
              onBuyNowClick={onBuyNowClick}
              nextProductId={nextProductId}
              prevProductId={prevProductId}
              {...props}
            />
          ))}
      </Component>
    </Suspense>
  );
};

export default ComponentResolver;