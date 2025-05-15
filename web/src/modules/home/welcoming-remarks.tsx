import BatikPattern from "@/components/Element/batik-pattern";
import { Heading, SubHeading } from "@/components/Layout/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";
import * as motion from "motion/react-client";

export default function WelcomingRemarks() {
  return (
    <main className="bg-foreground relative z-0 min-h-[100dvhx] overflow-hidden">
      <Container>
        <div className="bg-orange-blur/40 pointer-events-none absolute z-1 h-[20px] w-[80vw] translate-y-5 rounded-full blur-3xl lg:left-125 lg:h-[350px] lg:w-[1000px] lg:-translate-x-1/2" />
        {/* Background Batik */}

        <div className="w- z-10 flex flex-col gap-5 lg:gap-[38px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2 lg:hidden"
          >
            <SubHeading>Hear From Our Leaders</SubHeading>
            <Heading>Welcoming Remarks</Heading>
          </motion.div>

          {/* BORDER KUNING */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 60,
              damping: 15,
            }}
            className="border-gold relative mx-auto w-full shrink-0 overflow-hidden rounded-xl border md:border-2"
          >
            {/* Pattern Kanan*/}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute top-3 right-3 z-50 md:top-6 md:right-6 lg:top-3 lg:right-3"
            >
              <Image
                src="/assets/theme/pattern.webp"
                alt="Pattern JOINMUN 2025"
                height={392}
                width={392}
                className="max-w-24 md:max-w-36 lg:max-w-64"
              />
            </motion.div>
            {/* Pattern Kiri */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute top-3 left-3 z-50 md:bottom-6 md:left-6 lg:bottom-3 lg:left-3"
            >
              <Image
                src="/assets/theme/pattern.webp"
                alt="Pattern JOINMUN 2025"
                height={392}
                width={392}
                className="max-w-24 scale-x-[-1] md:max-w-36 lg:max-w-64"
              />
            </motion.div>

            {/* Nama Kiri */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute bottom-3 left-3 z-50 hidden md:bottom-6 md:left-6 md:block lg:bottom-3 lg:left-3"
            >
              <SubHeading>
                {" "}
                Puti Khayira Naila
                <br />
                Secretary General, JOINMUN 2025{" "}
              </SubHeading>
            </motion.div>

            {/* Nama Kanan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute right-3 bottom-3 z-50 hidden md:right-6 md:bottom-6 md:block lg:right-3 lg:bottom-3"
            >
              <SubHeading className="text-right">
                {" "}
                RM Drasthya Wironegoro
                <br />
                President, JOINMUN 2025{" "}
              </SubHeading>
            </motion.div>

            {/* Leaders Section */}
            <Image
              src="/assets/home/welcoming/long.webp"
              alt="Pattern JOINMUN 2025"
              height={3946}
              width={2247}
              priority
              className="w-full"
            />
          </motion.div>

          <div className="flex flex-col gap-2 text-left">
            <div className="hidden flex-col gap-2 lg:flex">
              <SubHeading>Hear From Our Leaders</SubHeading>
              <Heading>Welcoming Remarks</Heading>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, type: "tween" }}
              viewport={{ once: true }}
              className="text-justify"
            >
              Greetings, Esteemed Delegates,
              <br />
              <br />
              We are Puti Khayira Naila and RM Drasthya Wironegoro, and it is our honor to serve as
              the Secretary General and President of Jogja International Model United Nations 2025.
              <br />
              <br />
              Our paths to Leading JOINMUN 2025 have been unique, but what unites us is a shared
              belief in MUN&apos;s transformative power. As a Computer Science major, Puti Khayira
              Naila came from a world of logic and structure—but MUN introduced her to diplomacy,
              advocacy, and the importance of human connection. RM Drasthya Wironegoro, on the other
              hand, has always been inspired by the potential of meaningful, well-crafted events to
              shape impactful experiences. He believes that a great MUN isn&apos;t just about
              committee sessions—it&apos;s also about the moments in between: the shared
              conversations, the friendships formed, and the memories created.
              <br />
              <br />
              Together, we see JOINMUN not just as a conference, but as a global community—a
              gathering of minds dedicated to understanding, advocacy, and change. Through MUN,
              we&apos;ve both found friendships that cross borders and lessons that extend far
              beyond debate rooms. To all delegates: take this opportunity to challenge yourself, to
              listen and speak with purpose, and to make your time here truly meaningful. This is
              more than a simulation—it&apos;s your platform for growth and leadership. Don&apos;t
              underestimate the power you hold. You are the leaders, the changemakers, and the
              advocates of tomorrow. Seize every opportunity, connect with purpose, and remember:
              your words and actions here can create a ripple effect far beyond these sessions.
              <br />
              <br />
              Carpe Diem—Seize this moment, and make it count.
            </motion.p>
            <SubHeading className="mt-5 block md:hidden">
              Warm Regards, <br />
              <br />
              RM Drasthya Wironegoro,
              <br /> President, JOINMUN 2025
              <br />
              <br />
              Puti Khayira Naila, <br />
              Secretary General JOINMUN 2025
            </SubHeading>
          </div>
        </div>
      </Container>
      <BatikPattern />
    </main>
  );
}

{
  /* <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
  
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.9 }}
    className="absolute top-[20%] left-0 flex flex-col items-center text-center"
  >
    <div className="border-gold relative h-32 w-32 overflow-hidden rounded-full border-2 md:h-36 md:w-36 lg:h-40 lg:w-40">
      <Image
        src="/assets/dashboard/home/Model 1.webp"
        alt="Puti Khayira Naila"
        fill
        className="object-cover"
      />
    </div>
    <h3 className="mt-3 text-lg font-bold md:text-xl">Puti Khayira Naila</h3>
    <p className="text-muted-foreground text-sm md:text-base">Secretary General, JOINMUN 2025</p>
  </motion.div>

  
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 1.1 }}
    className="absolute top-[60%] right-0 flex flex-col items-center text-center"
  >
    <div className="border-gold relative h-32 w-32 overflow-hidden rounded-full border-2 md:h-36 md:w-36 lg:h-40 lg:w-40">
      <Image
        src="/assets/dashboard/home/Model 1.webp"
        alt="RM Drasthya Wironegoro"
        fill
        className="object-cover"
      />
    </div>
    <h3 className="mt-3 text-lg font-bold md:text-xl">RM Drasthya Wironegoro</h3>
    <p className="text-muted-foreground text-sm md:text-base">President, JOINMUN 2025</p>
  </motion.div>
</div>; */
}
