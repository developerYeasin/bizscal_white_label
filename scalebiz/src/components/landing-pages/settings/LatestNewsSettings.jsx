"use client";

import React from "react";
import CollapsibleCard from "@/components/ui/CollapsibleCard.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { uploadSingleImage } from "@/utils/upload.js";
import { showError } from "@/utils/toast.js";

const LatestNewsSettings = ({ component, index, updateNested, isUpdating }) => { // Accept updateNested, isUpdating as props
  const fileInputRefs = React.useRef({});

  const handleUpdateField = (field, value) => {
    console.log(`LatestNewsSettings: Updating field: ${field}, value: ${value}`);
    updateNested(`data.${field}`, value); // Path relative to component.data
  };

  const handleAddPost = () => {
    const newPost = { id: Date.now(), title: "New Blog Post", description: "Short description of the post.", imageUrl: "", link: "#", date: new Date().toISOString().slice(0, 10) }; // Assign unique ID
    const updatedPosts = [...(component.data.posts || []), newPost];
    handleUpdateField('posts', updatedPosts);
  };

  const handleRemovePost = (postIdToRemove) => {
    const updatedPosts = (component.data.posts || []).filter((post) => post.id !== postIdToRemove);
    handleUpdateField('posts', updatedPosts);
    showError("Post removed from local configuration.");
  };

  const handleUpdatePostField = (postId, field, value) => {
    console.log(`LatestNewsSettings: Updating post ${postId} field: ${field}, value: ${value}`);
    const updatedPosts = [...(component.data.posts || [])].map((post) =>
      post.id === postId ? { ...post, [field]: value } : post
    );
    handleUpdateField('posts', updatedPosts);
  };

  const handleImageUpload = async (event, postId) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { imageUrl } = await uploadSingleImage(file);
      handleUpdatePostField(postId, 'imageUrl', imageUrl);
    } catch (error) {
      // Error handled by toast utility
    }
  };

  return (
    <CollapsibleCard
      title={`Latest News (ID: ${component.id})`}
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor={`latest-news-title-${component.id}`}>Section Title</Label>
          <Input
            id={`latest-news-title-${component.id}`}
            value={component.data.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder="e.g., Latest from our Blog"
            disabled={isUpdating}
          />
        </div>

        <h3 className="text-lg font-semibold mt-4">Blog Posts</h3>
        <div className="space-y-4">
          {(component.data.posts || []).map((post) => (
            <div key={post.id} className="border p-3 rounded-md relative"> {/* Use unique ID for key */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
                onClick={() => handleRemovePost(post.id)}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`post-title-${component.id}-${post.id}`}>Title</Label>
                  <Input
                    id={`post-title-${component.id}-${post.id}`}
                    value={post.title || ''}
                    onChange={(e) => handleUpdatePostField(post.id, 'title', e.target.value)}
                    placeholder="Post Title"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label htmlFor={`post-link-${component.id}-${post.id}`}>Link</Label>
                  <Input
                    id={`post-link-${component.id}-${post.id}`}
                    value={post.link || ''}
                    onChange={(e) => handleUpdatePostField(post.id, 'link', e.target.value)}
                    placeholder="/blog/post-slug"
                    disabled={isUpdating}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`post-description-${component.id}-${post.id}`}>Description</Label>
                  <Textarea
                    id={`post-description-${component.id}-${post.id}`}
                    value={post.description || ''}
                    onChange={(e) => handleUpdatePostField(post.id, 'description', e.target.value)}
                    placeholder="Post Description"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label htmlFor={`post-date-${component.id}-${post.id}`}>Date</Label>
                  <Input
                    id={`post-date-${component.id}-${post.id}`}
                    type="date"
                    value={post.date || ''}
                    onChange={(e) => handleUpdatePostField(post.id, 'date', e.target.value)}
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[`${component.id}-${post.id}`] = el}
                      onChange={(e) => handleImageUpload(e, post.id)}
                      accept="image/png, image/jpeg, image/gif"
                      style={{ display: 'none' }}
                      disabled={isUpdating}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRefs.current[`${component.id}-${post.id}`]?.click()}
                      disabled={isUpdating}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {post.imageUrl ? "Change Image" : "Upload Image"}
                    </Button>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.title} className="h-16 w-auto object-contain rounded-md border" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddPost} disabled={isUpdating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>
    </CollapsibleCard>
  );
};

export default LatestNewsSettings;