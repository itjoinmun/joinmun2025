import BatikPattern from "@/components/batik-pattern";
import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const Timeline = () => {
  return (
    <main
      id="rundown"
      className="from-foreground to-red-normal relative -z-10 overflow-hidden bg-gradient-to-b"
    >
      <Container className="gap-2">
        <SubHeading>Save The Date</SubHeading>
        <section className="flex flex-col gap-2 md:gap-6 md:flex-row md:items-start md:justify-between">
          <Heading>Timeline</Heading>

          <div className="text-sm text-white md:max-w-lg">
            Get a clear view of all the important dates, from registration to the conference days.
            This timeline helps you stay prepared at every stage.
          </div>
        </section>
      </Container>

      <BatikPattern />
    </main>
  );
};

export default Timeline;
