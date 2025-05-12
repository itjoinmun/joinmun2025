import BatikPattern from "@/components/Element/batik-pattern";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";

export default function WelcomingRemarks() {
  return (
    <main className="bg-foreground relative z-0 min-h-[100dvhx]">
      <Container>
        <div className="bg-orange-blur/60 pointer-events-none absolute z-1 h-[20px] w-[80vw] translate-y-5 rounded-full blur-3xl lg:left-125 lg:h-[350px] lg:w-[1000px] lg:-translate-x-1/2" />
        {/* Background Batik */}

        <div className="w- z-10 flex flex-col gap-5 lg:flex-row lg:gap-[38px]">
          <div className="flex flex-col gap-2 lg:hidden">
            <SubHeading>Hear From Our Leaders</SubHeading>
            <Heading>Welcoming Remarks</Heading>
          </div>

          <Image
            src={"/assets/welcoming-remarks/KKM07434.jpg"}
            alt="KKM07434"
            className="w-full object-cover md:max-h-[450px] md:self-center lg:w-[40vw] lg:self-auto xl:w-[35vw] 2xl:w-[30vw]"
            width={546}
            height={345}
          />

          <div className="flex flex-col gap-2 text-left">
            <div className="hidden flex-col gap-2 lg:flex">
              <SubHeading>Hear From Our Leaders</SubHeading>
              <Heading>Welcoming Remarks</Heading>
            </div>

            <p className="text-justify">
              Welcome to JOINMUN, where ideas converge, collaboration thrives, and connections are
              made. We are truly honored to welcome all our esteemed guests, delegates, and
              participants who have taken the time to be here with us today. <br />
              <br />
              Your presence is a testament to the shared commitment we hold toward global dialogue,
              etc. This gathering would not be the same without the valuable perspectives,
              expertise, and energy each of you brings. Thank you for being part of this special
              occasion. We look forward to a meaningful and inspiring time together.
            </p>
          </div>
        </div>
      </Container>
      {/* Ellipse Blur */}
      {/* <div className="bg-orange-blur/70 pointer-events-none absolute left-1/2 z-30 h-[350px] w-full lg:w-1/2 -translate-x-1/2 rounded-full blur-3xl" /> */}
      <BatikPattern />
    </main>
  );
}
