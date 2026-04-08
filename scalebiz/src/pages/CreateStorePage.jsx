"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api.js";
import { showSuccess, showError } from "@/utils/toast.js";
import { useAuth } from "@/contexts/AuthContext.jsx"; // To get user email/phone
import { Loader2 } from "lucide-react";

const createStoreApi = async (storeData) => {
  const response = await api.post("/owner/stores", storeData);
  return response.data;
};

const CreateStorePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get authenticated user data

  const [country, setCountry] = React.useState("");
  const [businessType, setBusinessType] = React.useState("");
  const [businessName, setBusinessName] = React.useState("");
  const [businessAddress, setBusinessAddress] = React.useState("");

  const createStoreMutation = useMutation({
    mutationFn: createStoreApi,
    onSuccess: (data) => {
      showSuccess(data.message || "Store created successfully!");
      // Invalidate store configuration query to refetch the new config
      queryClient.invalidateQueries({ queryKey: ["storeConfiguration"] });
      navigate("/dashboard");
    },
    onError: (err) => {
      showError(err.response?.data?.details || err.response?.data?.error || "Failed to create store.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!country || !businessType || !businessName || !businessAddress) {
      showError("All fields are required.");
      return;
    }

    const payload = {
      store_name: businessName,
      business_type: businessType,
      country: country,
      shop_address: businessAddress,
      // Default/derived values for other fields not in this form
      shop_email: user?.email || "default@example.com",
      shop_phone_number: user?.phone_number || "N/A",
      shop_details: "",
      topbar_announcement: "",
    };

    createStoreMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md my-8 mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">You are almost done 👋</CardTitle>
          <CardDescription>
            Fill out the form to start your business. We're here to support you every step of the way.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry} disabled={createStoreMutation.isPending}>
                  <SelectTrigger id="country" className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType} disabled={createStoreMutation.isPending}>
                  <SelectTrigger id="businessType" className="mt-1">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="businessName">Business name</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={createStoreMutation.isPending}
                required
              />
            </div>
            <div>
              <Label htmlFor="businessAddress">Business address</Label>
              <Input
                id="businessAddress"
                placeholder="Enter your business address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                disabled={createStoreMutation.isPending}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={createStoreMutation.isPending}>
              {createStoreMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Complete"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            You can update this information anytime later from your settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStorePage;