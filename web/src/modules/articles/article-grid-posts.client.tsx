"use client";

import { Article } from "../../../payload-types";
import ArticleCard from "./article-card";
import { useArticleSearch } from "./article-search-bar";
import { ClockFadingIcon, Frown } from "lucide-react";

const isReveal = process.env.NEXT_PUBLIC_ARTICLES_REVEAL === "true";

const ArticleGridPostsClient = ({ articles }: { articles: Article[] }) => {
  const query = useArticleSearch()?.query.toLowerCase() || "";
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(query) ||
      (typeof article.media === "object" &&
        article.media.author &&
        article.media.author.toLowerCase().includes(query)),
  );

  return (
    <>
      {isReveal ? (
        filteredArticles.length > 0 ? (
          filteredArticles.map((article) => <ArticleCard key={article.id} {...article} />)
        ) : (
          <div className="text-accent col-span-full flex min-h-80 flex-col items-center justify-center gap-4 text-center">
            <Frown className={`text-accent col size-16`} />
            <p>No articles found. Try searching for another article!</p>
          </div>
        )
      ) : (
        <div className="text-accent col-span-full flex min-h-80 flex-col items-center justify-center gap-4 text-center">
          <ClockFadingIcon className={`text-accent col size-16`} />
          <p className="text-pretty">Stay tuned. The articles will be published soon!</p>
        </div>
      )}
    </>
  );
};

export default ArticleGridPostsClient;
