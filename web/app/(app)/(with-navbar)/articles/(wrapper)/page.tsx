import Container from "@/components/ui/container";
import ArticleCard from "@/modules/articles/article-card";

const ArticlesPage = () => {
  return (
    <Container className="grid grid-cols-1 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ArticleCard key={index} />
      ))}
    </Container>
  );
};

export default ArticlesPage;
