"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MediaPublisher } from "../../../payload-types";

const ArticleFiltersClient = ({ publishers }: { publishers: MediaPublisher[] }) => {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  return (
    <>
      <Button variant={pathname === "/articles" ? "primary" : "outline"} asChild>
        <Link href={`/articles`}>All</Link>
      </Button>

      {publishers.map((publisher) => (
        <Button
          key={publisher.id}
          variant={pathname === `/articles/${publisher.slug}` ? "primary" : "outline"}
          asChild
        >
          <Link href={`/articles/${publisher.slug}`}>{publisher.name}</Link>
        </Button>
      ))}
    </>
  );
};

export default ArticleFiltersClient;
