import { buttonVariants } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Container from "@/components/ui/container";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="grid h-screen place-items-center">
      <Container className="h-full items-center justify-center gap-2 *:text-center">
        <h1 className="mb-2 flex items-center text-8xl font-bold text-white/40">
          4
          <Frown className="size-20" />4
        </h1>
        <h1 className="text-xl font-bold">Page Not Found!</h1>
        <h2 className="mb-4 text-center">
          We couldn't locate the page. It might've been updated or no longer available.
        </h2>
        <Link href={`/`} className={buttonVariants({ variant: "outline" })}>
          Go Home
        </Link>
      </Container>
    </main>
  );
};

export default NotFound;
