"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Alert, AlertDescription } from "@/components/ui/alert.jsx";
import { AlertCircle, Code2 } from "lucide-react";
import { useStoreConfig } from "@/contexts/StoreConfigurationContext.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import MonacoEditor from "@/components/ui/MonacoEditor.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";

const CustomCodeEditor = () => {
  const { config, isLoading, updateNested, isUpdating } = useStoreConfig();
  const [activeTab, setActiveTab] = useState("css");

  if (isLoading || !config) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const customCss = config.page_settings?.custom_css || "";
  const customJs = config.page_settings?.custom_js || "";

  const handleCssChange = (value) => {
    updateNested('page_settings.custom_css', value);
  };

  const handleJsChange = (value) => {
    updateNested('page_settings.custom_js', value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Custom Code (CSS & JavaScript)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Advanced: Only add code you understand. Custom CSS and JavaScript will be injected into your storefront&apos;s &lt;head&gt; and &lt;body&gt; respectively.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="space-y-2 mt-4">
            <Label htmlFor="custom-css" className="text-sm font-medium">
              Custom CSS
            </Label>
            <MonacoEditor
              id="custom-css"
              value={customCss}
              onChange={handleCssChange}
              language="css"
              height="400px"
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              This CSS will be added to your storefront&apos;s stylesheet and applied globally.
            </p>
          </TabsContent>

          <TabsContent value="javascript" className="space-y-2 mt-4">
            <Label htmlFor="custom-js" className="text-sm font-medium">
              Custom JavaScript
            </Label>
            <MonacoEditor
              id="custom-js"
              value={customJs}
              onChange={handleJsChange}
              language="javascript"
              height="400px"
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              This JavaScript will be injected before the closing &lt;/body&gt; tag. Use with caution.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomCodeEditor;
