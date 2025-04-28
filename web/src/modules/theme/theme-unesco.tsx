import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const ThemeUnesco = () => {
  return (
    <main className="bg-background relative -z-10 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Why The Cosmological Axis of Yogyakarta</SubHeading>
        <section className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-6">
          <Heading>Recognized by UNESCO</Heading>
        </section>
      </Container>
    </main>
  );
};

export default ThemeUnesco;
