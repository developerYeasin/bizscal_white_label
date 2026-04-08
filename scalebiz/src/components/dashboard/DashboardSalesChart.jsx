"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "2025-06-16", sales: 1000 },
  { name: "2025-06-17", sales: 1100 },
  { name: "2025-06-18", sales: 2200 },
  { name: "2025-06-19", sales: 3200 },
  { name: "2025-06-20", sales: 1100 },
  { name: "2025-06-21", sales: 1800 },
  { name: "2025-06-22", sales: 1000 },
  { name: "2025-06-23", sales: 1500 },
  { name: "2025-06-24", sales: 2800 },
  { name: "2025-06-25", sales: 1800 },
  { name: "2025-06-26", sales: 2000 },
  { name: "2025-06-27", sales: 1500 },
  { name: "2025-06-28", sales: 2500 },
  { name: "2025-06-29", sales: 1200 },
  { name: "2025-07-01", sales: 1800 },
  { name: "2025-07-02", sales: 1000 },
  { name: "2025-07-03", sales: 2000 },
  { name: "2025-07-04", sales: 3000 },
  { name: "2025-07-05", sales: 1500 },
  { name: "2025-07-06", sales: 2000 },
  { name: "2025-07-07", sales: 3000 },
  { name: "2025-07-08", sales: 1500 },
  { name: "2025-07-09", sales: 2500 },
];

const DashboardSalesChart = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Last 30 days report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSalesChart;