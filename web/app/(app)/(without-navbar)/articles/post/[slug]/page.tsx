import { getPayload } from "payload";
import config from "@payload-config";
import Container from "@/components/ui/container";
import { notFound } from "next/navigation";
import Image from "next/image";
import { RichText } from "@/components/payload/RichText";

export const revalidate = 3600

const ArticleBySlugPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const payload = await getPayload({ config });
  const {
    docs: [article],
  } = await payload.find({
    collection: "articles",
    where: {
      slug: { equals: slug },
    },
    depth: 10,
  });

  if (!article) notFound();

  return (
    <main>
      <section className="relative flex min-h-60 flex-col justify-end gap-2 bg-neutral-500 p-4 sm:p-8">
        <div className="z-10 mx-auto w-full max-w-5xl">
          <h1 className="text-2xl font-bold">{article.title}</h1>

          <h2 className="">{article.author}</h2>
        </div>

        <Image
          src={typeof article.image === "object" ? (article.image.url as string) : ""}
          alt={`Image for ${article.title}`}
          fill
          sizes="50%"
          className="object-cover"
        />
      </section>

      <Container className="max-w-3xl">
        {article.content && <RichText data={article.content} />}
      </Container>
    </main>
  );
};

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs: articles } = await payload.find({
    collection: "articles",
    depth: 100,
    limit: 100,
  });

  return articles.map((article) => ({ slug: article.slug }));
}

export default ArticleBySlugPage;
