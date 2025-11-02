import Container from "@/components/ui/container";
import config from "@payload-config";
import { getPayload } from "payload";
import ArticleCard from "../articles/article-card";
import { ClockFadingIcon } from "lucide-react";

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
        {articles.length > 0 ? (
          articles.map((article) => <ArticleCard key={article.id} {...article} />)
        ) : (
          <div className="text-accent col-span-full flex min-h-80 flex-col items-center justify-center gap-4 text-center">
            <ClockFadingIcon className={`text-accent col size-16`} />
            <p className="text-pretty">Stay tuned. The articles will be published soon!</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default HomeArticles;
