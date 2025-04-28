import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const ThemeUnesco = () => {
  return (
    <main className="bg-background relative -z-10 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Why The Cosmological Axis of Yogyakarta</SubHeading>
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <Heading>Recognized by UNESCO</Heading>
        </section>
      </Container>
    </main>
  );
};

export default ThemeUnesco;
