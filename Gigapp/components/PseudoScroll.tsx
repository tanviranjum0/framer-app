// const images = [
//   "https://business.adobe.com/blog/basics/media_1344a5a68032785bf8eb18e748f92b1078812f729.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_14e35529cffcb7d5fe9d68dc1fbcf3662196be3f3.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_191d4264f4b2a54c2cc964c335309b8cbdb066087.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_1bc0275f4fc0ef95aedef70cfaa71e62c9e01473d.png?width=2000&format=webply&optimize=medium",
//   "https://business.adobe.com/blog/basics/media_10739d296019a74991795ffe17ee73afc8447df67.png?width=2000&format=webply&optimize=medium",
// ];
// https://enoughcreativity.com/?ref=onepagelove
"use client";
import React from "react";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { useState } from "react";
import Image from "next/image";
const images = [
  "https://business.adobe.com/blog/basics/media_1344a5a68032785bf8eb18e748f92b1078812f729.png?width=2000&format=webply&optimize=medium",
  "https://business.adobe.com/blog/basics/media_14e35529cffcb7d5fe9d68dc1fbcf3662196be3f3.png?width=2000&format=webply&optimize=medium",
  "https://business.adobe.com/blog/basics/media_191d4264f4b2a54c2cc964c335309b8cbdb066087.png?width=2000&format=webply&optimize=medium",
  "https://business.adobe.com/blog/basics/media_1bc0275f4fc0ef95aedef70cfaa71e62c9e01473d.png?width=2000&format=webply&optimize=medium",
  "https://business.adobe.com/blog/basics/media_10739d296019a74991795ffe17ee73afc8447df67.png?width=2000&format=webply&optimize=medium",
];
export default function StickyImageScroll() {
  const [inViewSection, setInViewSection] = useState<string>("one");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setInViewSection("one");
    } else if (latest >= 0.33 && latest < 0.66) {
      setInViewSection("two");
    } else if (latest >= 0.66) {
      setInViewSection("three");
    }
    const count = document.getElementById("count");
    if (!count) return;
    if (count) {
      count.innerText = `${Math.round(latest * 100)}%`;
    }
  });

  return (
    <div className="w-full min-h-screen box-border flex items-center justify-center">
      <section
        ref={containerRef}
        className="relative flex  w-full inset-0 -my-0 min-h-[500vh] bg-gradient-to-br from-[#015149] to-[#023c36]"
      >
        {/* Left sticky section */}
        <div className="w-2/5 sticky top-0 h-screen flex flex-col items-center justify-center p-8">
          {inViewSection === "one" ? (
            <div>
              <div className="text-xl w-full">We&apos;re for all humans</div>
              <motion.div className="italic">
                <span className="font-bold text-xl text-[#b4f4ed]">
                  Creativity
                </span>
                is everywhere and it should be for everyone. But most of us are
                life-tired and have lost our hobbies, connection, and regularly
                having meaningful moments. Let&apos;s fix that.
              </motion.div>
              <Image
                unoptimized
                width={1000}
                height={1000}
                src="https://framerusercontent.com/images/NYXSuNHIqB6GMw7IXSDSqYLr8FM.gif"
                alt=""
                className={`w-full h-min mt-10 border-2 border-white shadow-[#b4f4ed] shadow-2xl rounded-3xl`}
              />
            </div>
          ) : (
            ""
          )}
          {inViewSection === "two" ? (
            <>
              <div className="text-xl w-full">This is a no bullshit</div>
              <motion.div className="italic">
                <span className="font-bold text-xl text-[#a6d4f7]">We</span>
                know things are really shit. So in the meantime, we&apos;re
                going to make our lives more meaningful by getting out of
                doomscrolling and playing in the real world while the end nears.
                How you ask?
              </motion.div>
              <Image
                width={1000}
                unoptimized
                height={1000}
                src="https://framerusercontent.com/images/X3tpBaAWxasL0qWdEs8P1u6Q.gif"
                alt=""
                className={`w-full h-min mt-10 border-2 border-white shadow-[#2a5a7f] shadow-2xl rounded-3xl`}
              />
            </>
          ) : (
            ""
          )}
          {inViewSection === "three" ? (
            <>
              <div className="text-xl w-full">We&apos;re for all humans</div>
              <motion.div className="italic">
                <span className="font-bold text-xl text-[#c0a8be]"> Yeah,</span>
                the world feels like it&apos;s burning. But instead of drowning
                in endless feeds, we&apos;re choosing to squeeze the juice out
                of life — making memories, building, laughing, creating, and
                actually touching the real world before the curtain falls.
                Curious how?
              </motion.div>
              <Image
                unoptimized
                width={1000}
                height={1000}
                src="https://framerusercontent.com/images/YTx0Nilb6NZn0z5EnXtsE4s78.gif"
                alt=""
                className={`w-full h-min mt-10 border-2 border-white shadow-[#40273e] shadow-2xl rounded-3xl`}
              />
            </>
          ) : (
            ""
          )}
        </div>
        {/* Right sticky image showcase */}
        <div className="sticky right-0 top-0 w-3/5 h-screen flex items-center justify-center">
          <div className="relative w-full h-full">
            {images.map((src, i) => (
              <RightStickyImage
                key={i}
                src={src}
                i={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const RightStickyImage = ({
  src,
  i,
  scrollYProgress,
}: {
  src: string;
  i: number;
  scrollYProgress: MotionValue;
}) => {
  const start = i / images.length;
  const end = (i + 1) / images.length;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.7, 1]);
  const roundedBorder = useTransform(
    scrollYProgress,
    [start, end],
    ["100%", "0px"]
  );
  return (
    <motion.img
      key={i}
      src={src}
      alt={`Scenery ${i + 1}`}
      className={`absolute top-0 left-0 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white`}
      style={{
        opacity,
        scale,
        zIndex: i + 1,
        borderRadius: roundedBorder,
      }}
    />
  );
};
