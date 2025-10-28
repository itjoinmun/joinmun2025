import Container from "@/components/ui/container";
import config from "@payload-config";
import { getPayload } from "payload";
import ArticleGridPostsClient from "./article-grid-posts.client";

const ArticlesGridPosts = async (props: { media?: string }) => {
  const payload = await getPayload({ config });
  const { docs: articles } = await payload.find({
    collection: "articles",
    where: {
      ...(props.media && {
        "media.slug": {
          equals: props.media || null,
        },
      }),
      published: {
        equals: true,
      },
    },
    sort: "-publishedDate",
    limit: 100,
    depth: 10,
  });

  // console.log("articles", articles);

  return (
    <Container className="grid grid-cols-1 py-2 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
      <ArticleGridPostsClient articles={articles} />
    </Container>
  );
};

export default ArticlesGridPosts;
