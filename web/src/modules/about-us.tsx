import Container from "@/components/ui/container";
import Image from "next/image";
import { Heading, SubHeading } from "@/components/section-heading";

export default function AboutUs() {
  return (
    <main className="relative z-0 min-h-[100dvhx]">
      <Container>
        <div className="z-10 flex w-full flex-col gap-5 lg:flex-row lg:gap-[38px]">
          <div className="flex flex-col gap-2 lg:hidden">
            <SubHeading>About Us</SubHeading>
            <Heading>JOINMUN: Where Youth Drive Impact</Heading>
          </div>

          <Image
            src={"/assets/about-us/NKO02971.jpg"}
            alt="NKO02971"
            className="w-full object-cover md:max-h-[450px] md:self-center lg:w-[40vw] lg:self-auto xl:w-[35vw] 2xl:w-[30vw]"
            width={546}
            height={345}
          />

          <div className="flex flex-col gap-4 text-left">
            <div className="hidden flex-col gap-2 lg:flex">
              <SubHeading>About Us</SubHeading>
              <Heading>JOINMUN: Where Youth Drive Impact</Heading>
            </div>
            <p className="text-justify text-[18px] leading-[24px] font-[500]">
              Lorem ipsum dolor sit amet consectetur. Arcu scelerisque ultrices egestas ultrices
              aliquam arcu et egestas. Magnis ac parturient ac netus a eu. In risus tristique id
              consequat. Nibh pharetra gravida facilisis lacus faucibus scelerisque est luctus.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
