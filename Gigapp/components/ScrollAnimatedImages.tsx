"use client";
import {
  motion,
  useMotionValueEvent,
  useAnimate,
  useScroll,
  AnimatePresence,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
// https://www.scalefast.design/?ref=onepagelove

const ScrollAnimatedImages = () => {
  const imageOneText = "Stunning Visuals";
  const imageTwoText = "Engaging Content";
  const imageThreeText = "Effective Marketing";

  const [visibleText, setVisibleText] = useState<boolean | null>(false);
  const [scope, animate] = useAnimate();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const left1 = useTransform(scrollYProgress, [0.2, 0.4], [30, 0]);
  const left2 = useTransform(scrollYProgress, [0.2, 0.4], [18, 0]);
  const left3 = useTransform(scrollYProgress, [0.2, 0.4], [6, 0]);
  const margin = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);
  const topValue = useTransform(scrollYProgress, [0.1, 0.5], [-16, 0]);
  const rotateValue1 = useTransform(scrollYProgress, [0.1, 0.5], [-12, 0]);
  const rotateValue2 = useTransform(scrollYProgress, [0.1, 0.5], [12, 0]);
  const rotateValue3 = useTransform(scrollYProgress, [0.1, 0.5], [24, 0]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.7) {
      setVisibleText(true);
      animate(
        "#box1",
        {
          background:
            " linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(60, 122, 214, 1) 100%)",
        },
        { duration: 1 }
      );
      animate(
        "#box2",
        {
          background:
            " linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(60, 122, 214, 1) 100%)",
        },
        { duration: 1 }
      );
      animate(
        "#box3",
        {
          background:
            " linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(60, 122, 214, 1) 100%)",
        },
        { duration: 1 }
      );
    } else {
      setVisibleText(false);
      animate("#box1", { background: "transparent" });
      animate("#box2", { background: "transparent" });
      animate("#box3", { background: "transparent" });
    }
    if (latest < 0.7) {
      animate(scope.current, { gap: `${latest * 80}px` });
      animate(
        "#img1",
        {
          left: `${left1.get()}rem`,
          top: `${topValue.get()}rem`,
          rotate: rotateValue1.get(),
          scale: 1 + latest / 2,
        },
        { duration: 0.1 }
      );
      animate(
        "#img2",
        {
          left: `${left2.get()}rem`,
          top: `${topValue.get()}rem`,
          rotate: rotateValue2.get(),
          scale: 1 + latest / 2,
        },
        { duration: 0.1 }
      );
      animate(
        "#img3",
        {
          left: `${left3.get()}rem`,
          top: `${topValue.get()}rem`,
          rotate: rotateValue3.get(),
          scale: 1 + latest / 2,
        },
        { duration: 0.1 }
      );
    }
  });

  return (
    <div className="">
      <div className="w-full h-[100vh]">
        <motion.div
          style={{ margin }}
          ref={container}
          className="rounded-xl text-black p-20 bg-blue-200 m-5"
        >
          <div className="text-5xl ">Your design needs:</div>
          <div
            style={{
              fontSize: "5rem",
              position: "relative",
              fontWeight: "bold",
              lineHeight: 1.2,
              background: "linear-gradient(90deg, #FF0080, #7928CA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
            className="text-5xl col-span-12 my-1"
          >
            covered
          </div>

          <div className="text-xl col-span-12 my-3">
            Your marketing design success starts here. - everything
          </div>
          <div className="text-xl col-span-12 my-5 pb-5">
            you need to stand out, covered
          </div>

          <div className="flex justify-center items-center">
            <div ref={scope} className="flex -gap-10">
              <div className="flex items-center flex-col justify-center">
                <div
                  id="box1"
                  className="w-56 h-56 border-2 border-black rounded-md relative flex items-center justify-center"
                >
                  <motion.img
                    id="img1"
                    className="w-40 h-40 shadow-2xl rounded-md relative "
                    src="https://framerusercontent.com/images/pCTYQqNTGptGPVwm4XQcjvVJVYA.jpg"
                    alt="1"
                  />
                </div>
                <div className="flex space-x-1 justify-center">
                  <AnimatePresence>
                    {imageOneText.split("").map((char, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={visibleText ? { opacity: 1, x: 0 } : {}}
                        exit="hidden"
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="text-xl text-center font-bold tracking-tighter  md:leading-[4rem]"
                      >
                        {char === " " ? <span>&nbsp;</span> : char}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center flex-col justify-center">
                <div
                  id="box2"
                  className="w-56 h-56 font-story border-2 border-black rounded-md relative flex items-center justify-center"
                >
                  <motion.img
                    id="img2"
                    className="w-40 h-40  shadow-2xl rounded-md  relative "
                    src="https://framerusercontent.com/images/RFtM8rexwdQmv6rPx25in8tYVjc.jpg"
                    alt="2"
                  />
                </div>
                <div className="flex space-x-1 justify-center">
                  <AnimatePresence>
                    {imageTwoText.split("").map((char, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={visibleText ? { opacity: 1, x: 0 } : {}}
                        exit="hidden"
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="text-xl text-center font-bold tracking-tighter  md:leading-[4rem]"
                      >
                        {char === " " ? <span>&nbsp;</span> : char}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center flex-col justify-center">
                <div
                  id="box3"
                  className="w-56 h-56 border-2 border-black rounded-md relative flex items-center justify-center"
                >
                  <motion.img
                    id="img3"
                    className="w-40 h-40 shadow-2xl rounded-md  relative"
                    src="https://framerusercontent.com/images/X1bg7snSGmkNHOwDktMFzIghDI.jpg"
                    alt="3"
                  />
                </div>
                <div className="flex space-x-1 justify-center">
                  <AnimatePresence>
                    {imageThreeText.split("").map((char, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={visibleText ? { opacity: 1, x: 0 } : {}}
                        exit="hidden"
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="text-xl text-center font-bold tracking-tighter  md:leading-[4rem]"
                      >
                        {char === " " ? <span>&nbsp;</span> : char}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default ScrollAnimatedImages;
