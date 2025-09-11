import ArticlesGridPosts from "@/modules/articles/article-grid-posts";
import ArticlesGridPostsSuspense from "@/modules/articles/article-grid-posts.suspense";
import { Suspense } from "react";

// export const revalidate = 3600;

const ArticlesPage = () => {
  return (
    <Suspense fallback={<ArticlesGridPostsSuspense />}>
      <ArticlesGridPosts />
    </Suspense>
  );
};

export default ArticlesPage;
