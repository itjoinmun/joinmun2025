"use client";

import { Article } from "../../../payload-types";
import ArticleCard from "./article-card";
import { useArticleSearch } from "./article-search-bar";
import { Frown } from "lucide-react";

const ArticleGridPostsClient = ({ articles }: { articles: Article[] }) => {
  const query = useArticleSearch()?.query.toLowerCase() || "";
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(query) || article.author.toLowerCase().includes(query),
  );

  return (
    <>
      {filteredArticles.length > 0 ? (
        filteredArticles.map((article) => <ArticleCard key={article.id} {...article} />)
      ) : (
        <div className="text-accent col-span-full flex min-h-80 flex-col items-center justify-center gap-4 text-center">
          <Frown className={`text-accent col size-16`} />
          <p>No articles found. Try searching for another article!</p>
        </div>
      )}
    </>
  );
};

export default ArticleGridPostsClient;
