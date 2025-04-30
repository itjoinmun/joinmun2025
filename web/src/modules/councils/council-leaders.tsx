import { Heading, SubHeading } from "@/components/section-heading";
import { Council } from "@/utils/helpers/councils";
import { LeaderCarousel } from "./leaders-carousel";
import Container from "@/components/ui/container";

const CouncilLeaders = (props: Council) => {
  return (
    <section className="mt-14 flex flex-col gap-8">
      <Container className="py-0">
        <header className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-1">
            <SubHeading>Meet Your Council Leaders</SubHeading>
            <Heading>Chairs Profile</Heading>
          </div>
          <p className="text-sm text-pretty md:text-base">
            The brilliant minds leading this year&apos;s councils. With their experience and
            dedication, our Chairs are here to guide discussions.
          </p>
        </header>
      </Container>

      {/* Carousel */}
      <LeaderCarousel {...props} />
    </section>
  );
};

export default CouncilLeaders;
