import { Heading, SubHeading } from "@/components/Layout/section-heading";
import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/utils/helpers/cn";
import Link from "next/link";
import HomeArticles from "./home-articles";

const Articles = () => {
  return (
    <>
      <div
        id="articles"
        className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
        aria-hidden="true"
      />
      <Container className="gap-2">
        <SubHeading>Articles</SubHeading>

        <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-12">
          <Heading>Progressive Writing by JOINMUN Delegates</Heading>

          <div className="flex flex-col items-end justify-end gap-4 text-sm text-pretty text-white md:max-w-2xl">
            <Link
              href={`/articles`}
              className={cn(buttonVariants({ variant: "primary" }), "ml-auto w-fit md:ml-0")}
            >
              Read More
            </Link>
          </div>
        </section>
      </Container>

      {/* Featured Articles */}
      <HomeArticles />
    </>
  );
};

export default Articles;
