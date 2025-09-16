"use client";

import { Article } from "../../../payload-types";
import ArticleCard from "./article-card";
import { useArticleSearch } from "./article-search-bar";

const ArticleGridPostsClient = ({ articles }: { articles: Article[] }) => {
  const query = useArticleSearch()?.query.toLowerCase() || "";
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query),
  );

  return (
    <>
      {filteredArticles.length > 0 ? (
        filteredArticles.map((article) => <ArticleCard key={article.id} {...article} />)
      ) : (
        <p className="text-accent col-span-full text-center">No articles found</p>
      )}
    </>
  );
};

export default ArticleGridPostsClient;
