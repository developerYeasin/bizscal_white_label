import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";

/**
 * Axon Theme - Product Tabs Filter Component
 * Tabbed product filtering (Women's, Men's, Kids)
 */
const ProductTabsFilter = ({ data }) => {
  const {
    tabs = [
      { name: "Women's", active: true },
      { name: "Mens", active: false },
      { name: "Kids", active: false },
    ],
  } = data || {};

  const [activeTab, setActiveTab] = React.useState(tabs[0]?.name || "Women's");

  return (
    <section className="py-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              tab.name === activeTab
                ? "bg-[#E63946] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProductTabsFilter;
