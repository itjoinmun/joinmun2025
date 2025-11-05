"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import Container from "../container";
import { Heading, SubHeading } from "@/components/Layout/section-heading";

const images = [
  "/images/lummi/img15.png",
  "/images/lummi/img21.png",
  "/images/lummi/img3.png",
  "/images/lummi/img4.png",
  "/images/lummi/img5.png",
  "/images/lummi/img6.png",
  "/images/lummi/img7.png",
  "/images/lummi/img8.png",
  "/images/lummi/img24.png",
  "/images/lummi/img10.png",
  "/images/lummi/img11.png",
  "/images/lummi/img12.png",
  "/images/lummi/img13.png",
];

export default function Skiper30() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <main className="bg-background w-full text-white">
      {/*<div className="font-geist flex h-screen items-center justify-center gap-2">
        <div className="absolute top-[10%] left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs leading-tight uppercase opacity-40 after:absolute after:top-full after:left-1/2 after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            scroll down to see
          </span>
        </div>
      </div>*/}

      <div className="relative">
        <div
          ref={gallery}
          className="bg-background relative box-border flex h-[175vh] gap-[2vw] overflow-hidden p-[2vw]"
        >
          <Column
            images={[images[0], images[1], images[2], images[0], images[1], images[2]]}
            y={y}
          />
          <Column
            images={[images[3], images[4], images[5], images[0], images[1], images[2]]}
            y={y2}
          />
          <Column
            images={[images[6], images[7], images[8], images[0], images[1], images[2]]}
            y={y3}
          />
          <Column
            images={[images[9], images[10], images[11], images[0], images[1], images[2]]}
            y={y4}
          />
        </div>

        {/* Top gradient overlay */}
        <div className="from-background via-background absolute top-0 right-0 left-0 z-10 h-[22rem] bg-gradient-to-b via-10% to-transparent lg:h-84" />

        {/* Bottom gradient overlay */}
        <div className="from-background via-background absolute right-0 bottom-0 left-0 z-10 h-[22rem] bg-gradient-to-t via-10% to-transparent lg:h-84" />
      </div>

      <Container className="relative flex min-h-[400px] items-center justify-center gap-2">
        {/*<div className="absolute top-[10%] left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-white">*/}
        {/*<span className="relative max-w-[12ch] text-xs leading-tight">See You in JOINMUN 2026</span>*/}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 1.2,
            type: "spring",
            stiffness: 80,
          }}
          className="flex flex-col items-center justify-center"
        >
          <Heading className="text-gradient-gold mt-auto text-center">
            See You in <br className="lg:hidden" />
            JOINMUN 2026
          </Heading>
          <SubHeading>Stay tuned.</SubHeading>
        </motion.div>
        {/*</div>*/}
      </Container>
    </main>
  );
}

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

function Column({ images, y }: ColumnProps) {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[100px] flex-col gap-[2vw] first:top-[-45%] sm:min-w-[250px] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-auto w-full overflow-hidden">
          <img src={`/sai.png`} alt="image" className="pointer-events-none object-cover" />
        </div>
      ))}
    </motion.div>
  );
}
