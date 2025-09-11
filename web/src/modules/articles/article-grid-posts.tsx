import Container from "@/components/ui/container";
import ArticleCard from "@/modules/articles/article-card";
import { getPayload } from "payload";
import config from "@payload-config";

const ArticlesGridPosts = async (props: {
  media?: string
}) => {
  const payload = await getPayload({ config });
  const { docs: articles } = await payload.find({
    collection: "articles",
  });

  return (
    <Container className="grid py-2 grid-cols-1 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </Container>
  );
};

export default ArticlesGridPosts;
