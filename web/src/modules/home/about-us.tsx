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
            <Heading>JOINMUN: Redefining Justice, Reshaping Destiny</Heading>
            <SubHeading>Uniting for a World of True Equity and Enduring Security</SubHeading>
          </motion.div>

          <div className="relative aspect-[5/3] w-full shrink-0 object-cover md:max-h-[450px] md:self-center lg:w-[40vw] lg:self-auto xl:w-[35vw] 2xl:w-[30vw]">
            <Image
              src="/assets/about-us/NKO02971.jpg"
              alt="NKO02971"
              className="object-cover"
              fill
              sizes="100%"
            />
          </div>

          <div className="flex flex-col gap-4 text-left">
            <div className="hidden flex-col gap-2 lg:flex">
              <SubHeading>About Us</SubHeading>
              <Heading>JOINMUN: Redefining Justice, Reshaping Destiny</Heading>
              <SubHeading className="text-[110%]">
                Uniting for a World of True Equity and Enduring Security
              </SubHeading>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, type: "tween" }}
              viewport={{ once: true }}
              className="text-justify"
            >
              Jogja International Model United Nations is one of Indonesia&apos;s most prestigious
              international MUN with hundreds of delegates from over 10 countries worldwide. In its
              14th year, JOINMUN blends the core values of the UN with the richness of Javanese
              culture, serving as a platform for aspiring diplomats and changemakers.
              <br />
              <br className="lg:hidden xl:block" />
              In a world characterized by disparity and conflict, justice must surpass mere
              regulations—we must ensure equity in access to rights, resources, and opportunities.
              Transforming the future means confronting historical injustices and creating a world
              where every nation and individual can thrive. Enduring peace is only possible when we
              address the root causes of inequality together, aiming for a future where justice and
              security are not privileges, but universal guarantees.
            </motion.p>
          </div>
        </div>
      </Container>
    </main>
  );
}
