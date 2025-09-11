import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Article } from "../../../payload-types";
import { formatDate } from "@/utils/helpers/cn";
import Image from "next/image";

const ArticleCard = (props: Article) => {
  return (
    <div className="border-red overflow-clip rounded-sm border">
      <div className="relative h-24 w-full bg-neutral-800">
        <Image
          src={typeof props.image === "object" ? (props.image.url as string) : ""}
          loading="lazy"
          alt={props.title}
          sizes="100%"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-1 p-4 text-xs">
        <div className="text-accent flex items-center justify-between gap-1">
          <p>{formatDate(props.createdAt)}</p>
          <p>{props.author}</p>
        </div>

        <h2 className="text-lg font-bold text-white">{props.title}</h2>

        {props.description && <p className="text-accent line-clamp-1">{props.description}</p>}

        <div className="text-accent mt-auto flex items-center justify-between gap-2">
          <p>{typeof props.media === "object" && props.media.name && props.media.name}</p>

          <Button
            variant={`primary`}
            size={`sm`}
            className="h-7 text-xs hover:cursor-pointer"
            asChild
          >
            <Link href={`/articles/post/${props.slug}`}>Read</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
