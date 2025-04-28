import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";

const Events = () => {
  return (
    <main className="bg-background relative z-0 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Explore our</SubHeading>
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-12">
          <Heading>Series of Events</Heading>
          <div className="md:col-span-2 text-sm text-white ">
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
