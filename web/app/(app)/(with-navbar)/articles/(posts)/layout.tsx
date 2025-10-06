import ArticleFilters from "@/modules/articles/article-filters";
import { ArticleSearchProvider } from "@/modules/articles/article-search-bar";
import ArticlesHero from "@/modules/articles/hero";

const ArticlesWrapper = (props: { children?: React.ReactNode }) => (
  <>
    <ArticleSearchProvider>
      <ArticlesHero />
      <ArticleFilters />
      {props.children}
    </ArticleSearchProvider>
  </>
);

export default ArticlesWrapper;
