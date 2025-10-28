import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleFilters from "@/modules/articles/article-filters";
import { ArticleSearchProvider } from "@/modules/articles/article-search-bar";
import ArticlesHero from "@/modules/articles/hero";
import { Suspense } from "react";

const ArticlesWrapper = (props: { children?: React.ReactNode }) => (
  <>
    <ArticleSearchProvider>
      <ArticlesHero />
      <Suspense
        fallback={
          <Container>
            <Skeleton className="h-10 w-full" />
          </Container>
        }
      >
        <ArticleFilters />
      </Suspense>
      {props.children}
    </ArticleSearchProvider>
  </>
);

export default ArticlesWrapper;
