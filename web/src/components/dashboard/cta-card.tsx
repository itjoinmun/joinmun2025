import { cn } from "@/utils/helpers/cn";
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
    <article className="bg-background flex flex-col gap-1 rounded-md p-4">
      <h1 className="text-lg/snug font-bold">{title}</h1>
      <hr className="border-gray my-2 border-b-2" />
      <p className="mb-auto text-sm/snug">{description}</p>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "mt-2 ml-auto w-fit justify-self-end",
        )}
      >
        Enter
      </Link>
    </article>
  );
};

export default CTACard;
