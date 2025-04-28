import BatikPattern from "@/components/batik-pattern";
import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";

const ThemeTeaser = () => {
  return (
    <main className="from-foreground to-red-normal relative z-0 overflow-hidden bg-gradient-to-b">
      <Container className="gap-2">
        <SubHeading>Teaser</SubHeading>
        <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-12">
          <Heading>Whispers of The Theme</Heading>

          <div className="text-sm text-white ">
            Discover the essence behind the theme, before it unfolds in full. A quiet nod to
            something greater.
          </div>
        </section>
      </Container>

      <Container className="pt-4">
        <iframe
          src="https://www.youtube.com/embed/yVDIW_czMiI?si=C9ZstpjL4uI7CFQF"
          title="JOINMUN Teaser Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="z-10 mx-auto aspect-video w-full max-w-6xl"
        />
      </Container>
      <BatikPattern />
    </main>
  );
};

export default ThemeTeaser;
