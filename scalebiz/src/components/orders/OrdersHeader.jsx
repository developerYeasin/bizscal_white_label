"use client";

import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import { Search, Download, Plus, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Link } from "react-router-dom";
import { showSuccess, showInfo, showError } from "@/utils/toast.js";
import api from "@/utils/api.js";

const OrdersHeader = ({ searchTerm, onSearchChange, totalOrders }) => {
  const handleExport = async () => {
    showInfo("Exporting orders...");
    try {
      const response = await api.get("/owner/store/orders-export", {
        responseType: 'blob', // Important to handle raw data
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create a filename with the current date
      const date = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `orders-export-${date}.csv`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess("Orders exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      showError("Failed to export orders.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Badge variant="secondary" className="text-sm">{totalOrders}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              All <span className="ml-2">&#9660;</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => showInfo("Filtering by All")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Placed")}>Placed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Confirmed")}>Confirmed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Shipped")}>Shipped</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Delivered")}>Delivered</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Cancelled")}>Cancelled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => showInfo("Filtering by Returned")}>Returned</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button asChild>
          <Link to="/orders/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">0</Badge>
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">0</Badge>
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;