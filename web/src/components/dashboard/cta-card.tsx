import { cn } from "@/utils/cn";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const CTACard = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) => {
  return (
    <article className="bg-background rounded-md flex flex-col gap-1 p-4">
      <h1 className="text-lg/snug font-bold">{title}</h1>
      <hr className="border-b-2 border-gray my-2" />
      <p className="text-sm/snug mb-auto">{description}</p>
      <Link href={href} className={cn(buttonVariants({ variant: "primary" }), "ml-auto justify-self-end mt-2 w-fit")}>
        Enter
      </Link>
    </article>
  );
};

export default CTACard;
