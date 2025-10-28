"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MediaPublisher } from "../../../payload-types";

const ArticleFiltersClient = ({ publishers }: { publishers: MediaPublisher[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={pathname === "/articles" ? "warning" : "outline"} asChild>
        <Link href={`/articles`}>All</Link>
      </Button>

      {publishers.map((publisher) => (
        <Button
          key={publisher.id}
          variant={pathname === `/articles/${publisher.slug}` ? "warning" : "outline"}
          asChild
        >
          <Link href={`/articles/${publisher.slug}`}>{publisher.name}</Link>
        </Button>
      ))}
    </div>
  );
};

export default ArticleFiltersClient;
