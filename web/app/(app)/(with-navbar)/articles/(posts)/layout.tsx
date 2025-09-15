import ArticleFilters from "@/modules/articles/article-filters";
import ArticlesHero from "@/modules/articles/hero";

const ArticlesWrapper = (props: { children?: React.ReactNode }) => (
  <>
    <ArticlesHero />
    <ArticleFilters />
    {props.children}
  </>
);

export default ArticlesWrapper;
