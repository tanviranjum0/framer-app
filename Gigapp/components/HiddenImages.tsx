"use client";
import one from "@/public/hiddenImages/one.jpg";
import two from "@/public/hiddenImages/two.jpg";
import three from "@/public/hiddenImages/three.jpg";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

const HiddenImages = () => {
  const mainContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainContainer,
    offset: ["start end", "end start"],
  });

  const margin = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);
  const imageOne = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0, -200])
  );
  const imageTwo = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0, -280])
  );
  const imageThree = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0, -360])
  );
  return (
    <div
      ref={mainContainer}
      className="object-cover overflow-hidden w-full h-[100vh] mb-10"
    >
      <motion.div style={{ margin }}>
        <div className="relative py-20 px-16 overflow-hidden rounded-xl text-black bg-image-hidden-images ">
          <div className="flex flex-col gap-8 max-w-2xl">
            <div className="text-7xl tracking-wider">It&apos;s your moment</div>
            <div className="text-7xl">
              to <span className="font-extralight font-dancing">shine</span>
            </div>
            <div className="text-xl">
              Startups face cut-throat competition, ‘pretty designs’ just don’t
              cut it. Instead, we create conversion-focused designs that build
              trust, tell your story, and turn browsers into buyers.
            </div>
          </div>
        </div>
        <div className="flex relative justify-end ">
          <motion.div
            style={{
              top: imageOne,
            }}
            className="rounded-xl relative  shadow-2xl"
          >
            <Image
              className=""
              src={one}
              width={300}
              loading="lazy"
              draggable={false}
              alt="one image"
            />
          </motion.div>
          <motion.div
            style={{
              top: imageTwo,
            }}
            className="rounded-xl relative  shadow-2xl"
          >
            <Image
              className=""
              src={two}
              width={300}
              loading="lazy"
              draggable={false}
              alt="two image"
            />
          </motion.div>
          <motion.div
            style={{
              top: imageThree,
            }}
            className="rounded-xl relative  shadow-2xl"
          >
            <Image
              className=""
              src={three}
              width={300}
              loading="lazy"
              draggable={false}
              alt="three image"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HiddenImages;
