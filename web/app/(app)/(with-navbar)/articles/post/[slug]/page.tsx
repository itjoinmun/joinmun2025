import { RichText } from "@/components/payload/rich-text";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { formatDate } from "@/utils/helpers/cn";
import config from "@payload-config";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const revalidate = 3600;

const ArticleBySlugPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const payload = await getPayload({ config });
  const {
    docs: [article],
  } = await payload.find({
    collection: "articles",
    where: {
      slug: { equals: slug },
      published: {
        equals: true,
      },
    },
    depth: 10,
  });

  if (!article) notFound();

  return (
    <>
      <div className="relative mb-4 flex min-h-[60vh] flex-col justify-end gap-2 xl:min-h-[500px]">
        <Button variant={`ghost`} className="absolute top-24 left-4 sm:left-8" asChild>
          <Link href={`/articles`}>
            <ArrowLeft /> Back{" "}
          </Link>
        </Button>

        <Container className="z-10 mx-auto w-full max-w-3xl py-0">
          <h1 className="text-gradient-gold text-4xl font-bold">{article.title}</h1>
        </Container>

        <Image
          src={typeof article.image === "object" ? (article.image.url as string) : ""}
          alt={`Image for ${article.title}`}
          fill
          sizes="50%"
          className="-z-20 object-cover"
        />
        <div className="via-background/80 from-background absolute inset-0 -z-10 bg-gradient-to-t to-transparent" />
      </div>

      <Container className="max-w-3xl py-0">
        <div className="flex w-full flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-wrap items-center justify-between gap-6 text-sm font-bold">
              <p>{typeof article.media === "object" && article.media.name}</p>

              {/* <p className="flex items-center gap-1">
                <Clock className="size-4" /> 6 minute read
              </p> */}

              <p>{formatDate(article.createdAt)}</p>
            </div>

            <p className="text-sm text-neutral-300">
              By {typeof article.media === "object" && article.media.author && article.media.author}
            </p>
          </div>

          {/* <Button variant={`ghost`} size={`icon`}>
            <Share2 />
          </Button> */}
        </div>

        <hr className="border-accent my-8 w-full border-t-2" />

        {article.content && <RichText data={article.content} />}

        <hr className="border-accent my-8 w-full border-t-2" />
      </Container>
    </>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const payload = await getPayload({ config });
  const {
    docs: [article],
  } = await payload.find({
    collection: "articles",
    where: {
      slug: { equals: slug },
      published: {
        equals: true,
      },
    },
    depth: 10,
  });

  if (!article)
    return {
      title: `Not Found`,
      description: `The requested article was not found.`,
    };

  return {
    title: `${article.title} | JOINMUN 2025`,
    description: `${article.description || "Read the latest articles from JOINMUN 2025."}`,
  };
}

export default ArticleBySlugPage;
