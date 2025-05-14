import Container from "@/components/ui/container";
import Image from "next/image";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import * as motion from "motion/react-client";

export default function AboutUs() {
  return (
    <main className="relative z-0 h-auto">
      <Container>
        <div className="z-10 flex w-full flex-col gap-5 lg:flex-row lg:gap-[38px]">
          <motion.div
            className="flex flex-col gap-2 lg:hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SubHeading>About Us</SubHeading>
            <Heading>JOINMUN: Where Youth Drives Impact</Heading>
          </motion.div>

          <div className="relative w-full object-cover md:max-h-[450px] shrink-0 aspect-[5/4] md:self-center lg:w-[40vw] lg:self-auto xl:w-[35vw] 2xl:w-[30vw]">
            <Image
              src="/assets/about-us/NKO02971.jpg"
              alt="NKO02971"
              className="object-cover"
              fill
              sizes="100%"
            />
          </div>

          <div className="flex flex-col gap-4 text-left">
            <div
              className="hidden flex-col gap-2 lg:flex"
            >
              <SubHeading>About Us</SubHeading>
              <Heading>JOINMUN: Where Youth Drive Impact</Heading>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, type: "tween" }}
              viewport={{ once: true }}
              className="text-justify"
            >
              JOINMUN 2025 (Jogja International Model United Nations) is an international MUN
              conference hosted in Yogyakarta, Indonesia, uniting youth voices to confront
              today&apos;s most pressing global issues.
              <br />
              <br />
              This year&apos;s conference challenges delegates to reimagine global justice and
              contribute to building a fairer, safer world. Join future leaders, spark real
              conversations, and reshape what&apos;s possible — only at JOINMUN 2025.
            </motion.p>
          </div>
        </div>
      </Container>
    </main>
  );
}
