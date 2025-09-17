import ArticlesGridPosts from "@/modules/articles/article-grid-posts";
import ArticlesGridPostsSuspense from "@/modules/articles/article-grid-posts.suspense";
import config from "@payload-config";
import { getPayload } from "payload";
import { Suspense } from "react";

export const revalidate = 3600;

const ArticlesPage = async ({ params }: { params: Promise<{ media: string }> }) => {
  const { media } = await params;

  return (
    <Suspense fallback={<ArticlesGridPostsSuspense />}>
      <ArticlesGridPosts media={media} />
    </Suspense>
  );
};

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs: publishers } = await payload.find({
    collection: 'media-publishers',
  })

  return publishers.map(publisher => ({ media: publisher.slug }))
}

export default ArticlesPage;
