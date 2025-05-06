"use client";

import BatikPattern from "@/components/batik-pattern";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const ThemeTeaser = () => {
  return (
    <main className="from-foreground to-red-normal relative max-h-[100dvh] overflow-hidden bg-gradient-to-b">
      {/* <main className="relative max-h-[100dvh] overflow-hidden bg-background"> */}
      <Container className="gap-2">
        <SubHeading>Teaser</SubHeading>
        <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-12">
          <Heading>Whispers of The Theme</Heading>

          <div className="text-sm text-white">
            Discover the essence behind the theme, before it unfolds in full. A quiet nod to
            something greater.
          </div>
        </section>
      </Container>

      <Container className="max-w-4xl pt-0 2xl:max-w-6xl">
        {/* Video Player */}
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-bottom"
          // videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb&autoplay=1&mute=1"
          videoSrc="/assets/theme/like him.mp4?autoplay=1&mute=1"
          thumbnailSrc="/assets/theme/teaser-thumbnail.webp"
          thumbnailAlt="JOINMUN 2025 Teaser"
        />
        {/* Video Thumbnail */}
        <HeroVideoDialog
          className="hidden max-h-full w-auto dark:block"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="/assets/theme/teaser-thumbnail.webp"
          thumbnailAlt="JOINMUN 2025 Teaser"
        />
      </Container>
      <BatikPattern className="z-10" />
    </main>
  );
};

export default ThemeTeaser;
