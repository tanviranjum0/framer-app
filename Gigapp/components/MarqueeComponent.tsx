"use client";
import Marquee from "react-fast-marquee";
import React from "react";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import img1 from "@/public/MarqueImages/web1.png";
import img2 from "@/public/MarqueImages/web2.png";
import img3 from "@/public/MarqueImages/web3.png";
import img4 from "@/public/MarqueImages/web4.png";
import img5 from "@/public/MarqueImages/web5.png";
import img7 from "@/public/MarqueImages/web7.png";
import img8 from "@/public/MarqueImages/web8.png";
import img9 from "@/public/MarqueImages/web9.png";
import img10 from "@/public/MarqueImages/web10.png";
import img11 from "@/public/MarqueImages/web11.png";

interface MarqueItem {
  id: number;
  img: StaticImageData;
  height: number;
}

const items: MarqueItem[] = [
  {
    id: 1,
    img: img1,
    height: 220,
  },
  {
    id: 2,
    img: img2,
    height: 585,
  },
  {
    id: 3,
    img: img3,
    height: 300,
  },
  {
    id: 4,
    img: img4,
    height: 220,
  },
  {
    id: 5,
    img: img5,
    height: 220,
  },
  {
    id: 7,
    img: img7,
    height: 220,
  },
  {
    id: 8,
    img: img8,
    height: 546,
  },
  {
    id: 9,
    img: img9,
    height: 220,
  },
  {
    id: 10,
    img: img10,
    height: 300,
  },
  {
    id: 11,
    img: img11,
    height: 220,
  },
];
const MarqueeComponent = () => {
  return (
    <>
      <motion.div className="p-32 flex flex-col overflow-hidden justify-center items-center">
        <motion.div className="flex items-center gap-3 justify-center">
          <motion.div
            key={"New"}
            className="bg-red-500 rounded-full w-3 h-3"
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1, 0.5],
              opacity: [0, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          ></motion.div>
          <div className="uppercase text-lg text-gray-500">
            Available for new projects
          </div>
        </motion.div>
        <motion.div
          initial={{
            y: 50,
            opacity: 0.5,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            type: "spring",
          }}
          className="uppercase text-center my-5 font-bold text-6xl"
        >
          Motion turns static design into living, breathing experiences.
        </motion.div>
        <motion.div
          initial={{
            y: 50,
            opacity: 0.5,
          }}
          animate={{
            y: 0,

            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            type: "spring",
          }}
          className="text-center text-lg text-gray-500"
        >
          Get top-tier design in less than a week
        </motion.div>
        <motion.div
          initial={{
            y: 50,
            opacity: 0.5,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            type: "spring",
          }}
          className="text-center text-lg text-gray-500"
        >
          Subscriptions or one-time projects.
        </motion.div>
        <div className="flex w-full my-5 justify-center">
          <div id="contactButton" className="contactButton-contact">
            <span className="contactButtoncircle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="contact-text">Let&apos;s Work Together</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{
          skewY: 0,
        }}
        animate={{
          skewY: -6,
        }}
        transition={{
          duration: 1,
          type: "tween",
        }}
        className="flex mt"
      >
        <Marquee
          direction="right"
          className="marquee flex -mt-10 mb-32"
          autoFill={true}
          speed={40}
        >
          {items.map((data, i) => {
            return (
              <Image
                key={i + data.id}
                className={`rounded-xl   mx-2`}
                src={data.img}
                alt={`Marque image ${data.id}`}
                height={data.height}
              />
            );
          })}
        </Marquee>
      </motion.div>
    </>
  );
};

export default MarqueeComponent;
