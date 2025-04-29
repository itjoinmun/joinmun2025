import { Heading, SubHeading } from "@/components/section-heading";
import { Council } from "@/utils/helpers/councils";

const CouncilLeaders = (props: Council) => {
  return (
    <section className="flex flex-col gap-8 mt-14">
      <header className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col gap-1">
          <SubHeading>Meet Your Council Leaders</SubHeading>
          <Heading>Chairs Profile</Heading>
        </div>
        <p className="text-sm text-pretty md:text-base">
          This is a placeholder for council leader information.
        </p>
      </header>
    </section>
  );
};

export default CouncilLeaders;
