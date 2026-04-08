"use client";

import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const ChartContext = React.createContext(null);

function Chart({ children, ...props }) {
  const [config, setConfig] = React.useState({});
  const provideData = React.useMemo(
    () => ({
      config,
      setConfig,
    }),
    [config]
  );

  return (
    <ChartContext.Provider value={provideData}>
      <ChartContainer {...props}>{children}</ChartContainer>
    </ChartContext.Provider>
  );
}

const ChartLegend = React.forwardRef(
  ({ className, content, ...props }, ref) => {
    const { config } = React.useContext(ChartContext);

    if (!config) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4 px-2 text-xs font-medium text-muted-foreground",
          className
        )}
        {...props}>
        {content
          ? content()
          : Object.entries(config).map(([key, item]) => (
              <div key={key} className="flex items-center gap-1">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: `hsl(${item.color})`,
                  }} />
                <span>{item.label}</span>
              </div>
            ))}
      </div>
    );
  }
);
ChartLegend.displayName = "ChartLegend";

const ChartCrosshair = React.forwardRef(
  ({ className, content, ...props }, ref) => {
    return (
      <ChartTooltip
        ref={ref}
        content={
          content
            ? content()
            : ({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent
                      className="grid min-w-[150px] p-2"
                      {...props}>
                      {payload.map((item) => (
                        <div
                          key={item.dataKey}
                          className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor: `hsl(${item.color})`,
                              }} />
                            <span className="text-muted-foreground">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </ChartTooltipContent>
                  );
                }
                return null;
              }
        }
        {...props} />
    );
  }
);
ChartCrosshair.displayName = "ChartCrosshair";

export { Chart, ChartLegend, ChartCrosshair };