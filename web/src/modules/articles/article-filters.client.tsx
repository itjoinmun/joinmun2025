"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MediaPublisher } from "../../../payload-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const ArticleFiltersClient = ({ publishers }: { publishers: MediaPublisher[] }) => {
  const pathname = usePathname();
  const isAllActive = pathname === "/articles";
  const activePublisher = publishers.find(
    (publisher) => pathname === `/articles/${publisher.slug}`,
  );
  const currentLabel = isAllActive ? "All Media" : (activePublisher?.name ?? "Select Media");

  const MAX_VISIBLE_PUBLISHERS = 6;
  const visiblePublishers = publishers.slice(0, MAX_VISIBLE_PUBLISHERS);
  const overflowPublishers = publishers.slice(MAX_VISIBLE_PUBLISHERS);

  return (
    <div className="flex flex-wrap gap-2">
      <div className="hidden flex-wrap gap-2 md:flex">
        <Button variant={isAllActive ? "warning" : "outline"} asChild>
          <Link href={`/articles`}>All Media</Link>
        </Button>

        {visiblePublishers.map((publisher) => (
          <Button
            key={publisher.id}
            variant={pathname === `/articles/${publisher.slug}` ? "warning" : "gray"}
            asChild
          >
            <Link href={`/articles/${publisher.slug}`}>{publisher.name}</Link>
          </Button>
        ))}
      </div>

      {overflowPublishers.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-gold hidden md:inline-flex" variant="gray">
              Other Media <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray">
            {overflowPublishers.map((publisher) => (
              <DropdownMenuItem
                key={publisher.id}
                data-active={pathname === `/articles/${publisher.slug}` ? "true" : undefined}
                asChild
                className="data-[active=true]:bg-accent data-[active=true]:text-white"
              >
                <Link href={`/articles/${publisher.slug}`}>{publisher.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="text-gold w-full justify-between md:hidden" variant={"gray"}>
            {currentLabel} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray min-w-[320px]">
          <DropdownMenuItem
            key="all"
            data-active={isAllActive ? "true" : undefined}
            asChild
            className="data-[active=true]:bg-accent data-[active=true]:text-white"
          >
            <Link href={`/articles`}>All Media</Link>
          </DropdownMenuItem>
          {publishers.map((publisher) => (
            <DropdownMenuItem
              key={publisher.id}
              data-active={pathname === `/articles/${publisher.slug}` ? "true" : undefined}
              asChild
              className="data-[active=true]:bg-accent data-[active=true]:text-white"
            >
              <Link href={`/articles/${publisher.slug}`}>{publisher.name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ArticleFiltersClient;
