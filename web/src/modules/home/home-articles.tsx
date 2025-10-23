import Container from "@/components/ui/container";
import config from "@payload-config";
import { getPayload } from "payload";
import ArticleCard from "../articles/article-card";

const HomeArticles = async () => {
  const payload = await getPayload({ config });
  const { docs: articles } = await payload.find({
    collection: "articles",
    where: {
      published: {
        equals: true,
      },
    },
    sort: "-publishedDate",
    limit: 4,
    depth: 10,
  });

  return (
    <Container className="py-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </Container>
  );
};

export default HomeArticles;
