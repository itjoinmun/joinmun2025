import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "@/components/ui/container";
import { Heading, SubHeading } from "@/components/section-heading";

export default function ContactUs() {
  return (
    <main className="">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 lg:max-w-[754px]">
            <div className="flex flex-col gap-4">
              <SubHeading>Contact Us</SubHeading>
              <Heading>Get in Touch With Us</Heading>
              <p className="text-base font-medium text-pretty">
                Have questions or need assistance? Our team is here to help. Don&apos;t hesitate to
                reach out — we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <Link href={"/"} className="w-fit">
              <Button variant={"primary"} className="cursor-pointer">
                Contact Us
              </Button>
            </Link>
          </div>

          <Image
            src={"/assets/contact-us/LEF07703.jpg"}
            alt="KKM07434"
            className="w-full object-cover md:max-h-[450px] md:self-center lg:w-[40vw] lg:self-auto xl:w-[35vw] 2xl:w-[30vw]"
            width={546}
            height={345}
          />
        </div>
      </Container>
    </main>
  );
}
