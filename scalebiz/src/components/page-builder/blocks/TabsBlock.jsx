"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * Tabs Block
 *
 * Displays content in tabbed interface.
 *
 * Expected data structure:
 * - tabs: array of { id, title, content, icon? }
 * - variant: default | card | pills
 * - layout: horizontal | vertical
 */
const TabsBlock = ({ data, themeConfig, storeConfig }) => {
  const {
    tabs = [],
    variant = "default",
    layout = "horizontal",
    className = "",
  } = data || {};

  if (!tabs || tabs.length === 0) {
    return (
      <div className={`p-8 border-2 border-dashed rounded-lg text-center ${className}`}>
        <p className="text-muted-foreground text-sm">No tabs configured. Add tabs in settings.</p>
      </div>
    );
  }

  const tabsListClasses = layout === "vertical"
    ? "flex-col border-r"
    : "border-b";

  const contentClasses = layout === "vertical"
    ? "mt-4"
    : "mt-6";

  return (
    <div className={`tabs-block ${className}`}>
      <Tabs defaultValue={tabs[0]?.id} className={layout === "vertical" ? "flex" : ""}>
        <TabsList className={tabsListClasses}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className={contentClasses}>
            <div className="prose prose-sm max-w-none">
              {tab.content ? (
                <div dangerouslySetInnerHTML={{ __html: tab.content }} />
              ) : (
                <p className="text-muted-foreground">No content for this tab.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabsBlock;
