import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStorePath } from "@/hooks/use-store-path";

const BlogPostsSection = ({ data, className }) => {
  const { title, posts } = data;
  const getPath = useStorePath();

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8 md:py-12 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: `var(--dynamic-primary-color)`, fontFamily: `var(--dynamic-heading-font)` }}>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Card key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link to={getPath(post.link)}>
                <div className="relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-dynamic-primary-color text-dynamic-secondary-color px-3 py-1 rounded-full text-xs font-semibold">
                    {post.date}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground hover:text-dynamic-primary-color transition-colors" style={{ fontFamily: `var(--dynamic-heading-font)` }}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <span className="text-dynamic-primary-color text-sm font-medium hover:underline">
                    Read More
                  </span>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPostsSection;