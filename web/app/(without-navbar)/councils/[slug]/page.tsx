import { COUNCILS } from "@/utils/helpers/councils";
import BackLink from "@/components/back-link";
import { Button, buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import CouncilData from "@/modules/councils/council-data";
import CouncilLeaders from "@/modules/councils/council-leaders";
import Link from "next/link";
import { cn } from "@/utils/cn";
import NotFound from "../../../not-found";

const CouncilPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  if (!slug) return NotFound();

  const council = COUNCILS.find((council) => council.slug === slug);
  if (!council) return NotFound();

  return (
    <main className="relative min-h-screen">
      <Container className="gap-12">
        <Link href="/" className={cn(buttonVariants({ variant: "gray" }), 'w-fit')}>
            <ArrowLeft />
            Back
        </Link>

        <CouncilData {...council} />
        <CouncilLeaders {...council} />
      </Container>

      {/* image + overlay */}
      <Image
        // src={council.src}
        src={`/lebron.webp`}
        alt={council.fullname}
        width={1000}
        height={500}
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 max-h-[30vh] w-full object-cover brightness-50"
      />
    </main>
  );
};

export default CouncilPage;
