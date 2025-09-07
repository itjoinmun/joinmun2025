import Container from "@/components/ui/container";
import ArticleCard from "@/modules/articles/article-card";
import { getPayload } from "payload";
import config from "@payload-config";

const ArticlesPage = async () => {
  const payload = await getPayload({ config });
  const { docs: articles } = await payload.find({
    collection: "articles",
  });

  return (
    <Container className="grid grid-cols-1 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
      {/* {Array.from({ length: 8 }).map((_, index) => ( */}
      {/*   <ArticleCard key={index} /> */}
      {/* ))} */}
    </Container>
  );
};

export default ArticlesPage;
