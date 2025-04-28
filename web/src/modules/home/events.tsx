import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const Events = () => {
  return (
    <main className="bg-background relative -z-10 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Explore our</SubHeading>
        <section className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-6">
          <Heading>Series of Events</Heading>
          <div className="text-sm text-white md:max-w-2xl">
            JoinMUN is a 3-day event that brings together participants for diplomatic discussions.
            During the conference, delegates represent different countries and participate in
            workshops to enhance their skills. The event aims to foster collaboration, critical
            thinking, and international awareness.
          </div>
        </section>
      </Container>
    </main>
  );
};

export default Events;
