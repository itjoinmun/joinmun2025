import { Heading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import { ImageCarousel } from "@/modules/theme/image-carousel";

const ThemeInspired = () => {
  return (
    <main className="bg-background relative z-0 overflow-hidden pb-12">
      <Container className="gap-2">
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <Heading>What Inspired Us</Heading>

          <div className="text-sm text-white">
            This year, JOINMUN adopts the profound concept of the Sumbu Filosofi of Yogyakarta—a
            sacred line that connects the Southern Ocean, the Yogyakarta Palace, and Mount Merapi.
          </div>

          <div className="text-sm text-white">
            By choosing this theme, we aim to reflect the essence of balanced governance, unity in
            diversity, and the pursuit of peace—values deeply emainable vision.
          </div>
        </section>
      </Container>

      <ImageCarousel />

      {/* <BatikPattern /> */}
    </main>
  );
};

export default ThemeInspired;
