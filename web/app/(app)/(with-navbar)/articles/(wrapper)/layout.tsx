import ArticlesHero from "@/modules/articles/hero";

const ArticlesWrapper = (props: { children?: React.ReactNode }) => (
  <>
    <ArticlesHero />
    {props.children}
  </>
);

export default ArticlesWrapper;
