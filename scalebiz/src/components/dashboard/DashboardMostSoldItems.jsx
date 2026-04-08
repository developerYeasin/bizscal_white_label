"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";

const mockMostSoldItems = [
  { id: 1, name: "Torrey Three Piece", unit: 280 },
  { id: 2, name: "Lahori Three Piece", unit: 212 },
  { id: 3, name: "Butterfly Three Piece", unit: 23 },
];

const DashboardMostSoldItems = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Most Sold Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMostSoldItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DashboardMostSoldItems;