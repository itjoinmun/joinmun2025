import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "@/components/ui/container";
import { Heading, SubHeading } from "@/components/Layout/section-heading";

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

            <Link
              href={"https://ig.me/m/joinmun.ugm"}
              target="_blank"
              rel="noopener noreferer"
              className="w-fit"
            >
              <Button variant={"primary"} className="cursor-pointer">
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="4xl:w-[20vw] relative aspect-[5/3] w-full shrink-0 object-cover md:max-h-[450px] md:self-center lg:w-[40vw] lg:self-auto xl:w-[35vw] 2xl:w-[30vw]">
            <Image
              src="/assets/contact-us/LEF07703.jpg"
              alt="NKO02971"
              className="object-cover"
              fill
              sizes="100%"
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
