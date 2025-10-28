import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Article } from "../../../payload-types";
import { formatDate } from "@/utils/helpers/cn";
import Image from "next/image";

const ArticleCard = (props: Article) => {
  return (
    <div className="border-accent flex h-full flex-col overflow-clip rounded-sm border">
      <div className="relative aspect-[326/165] w-full bg-neutral-800">
        <Image
          src={typeof props.image === "object" ? (props.image.url as string) : ""}
          loading="lazy"
          alt={props.title}
          sizes="100%"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1 p-4 text-xs">
        <div className="text-accent flex items-center justify-between gap-1">
          <p>{formatDate(props.createdAt)}</p>
          <p>{typeof props.media === "object" && props.media.author && props.media.author}</p>
        </div>

        <h2 className="line-clamp-3 text-lg font-bold text-white">{props.title}</h2>

        {props.description && <p className="text-accent mt-1 line-clamp-1">{props.description}</p>}

        <div className="flex-1" />

        <div className="text-accent mt-auto mb-0 flex items-center justify-between gap-2">
          <p className="line-clamp-1 w-full">
            {typeof props.media === "object" && props.media.name && props.media.name}
          </p>

          <Button variant="primary" size="sm" className="h-7 text-xs hover:cursor-pointer" asChild>
            <Link href={`/articles/post/${props.slug}`}>Read</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
