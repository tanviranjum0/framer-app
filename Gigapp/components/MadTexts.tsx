"use client";
import { motion, useAnimate } from "motion/react";
const MadTexts = () => {
  const [scope, animate] = useAnimate();
  return (
    <div className="w-full py-10">
      <div className="text-center text-5xl py-5 font-story">
        Do you identify as any of these?
      </div>
      <ul ref={scope} className="flex justify-center items-center flex-col">
        <motion.li
          id="text1"
          onHoverStart={() => {
            animate(
              "#text1",
              { rotate: [-10, 0, 10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text1", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          want to feel more joy
        </motion.li>
        <motion.li
          id="text2"
          onHoverStart={() => {
            animate(
              "#text2",
              { rotate: [10, 0, -10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text2", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          desperately need to soothe my nervous system
        </motion.li>
        <motion.li
          id="text3"
          onHoverStart={() => {
            animate(
              "#text3",
              { rotate: [-10, 0, 10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text3", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          anguishing at the state of the world and utterly hopeless about it all
        </motion.li>
        <motion.li
          id="text4"
          onHoverStart={() => {
            animate(
              "#text4",
              { rotate: [10, 0, -10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text4", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          probably won’t ever get to buy a house but do have an interiors inspo
          folder
        </motion.li>
        <motion.li
          id="text5"
          onHoverStart={() => {
            animate(
              "#text5",
              { rotate: [-10, 0, 10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text5", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          breaking a little free from the algorithms and doom scrolling
        </motion.li>
        <motion.li
          id="test6"
          onHoverStart={() => {
            animate(
              "#test6",
              { rotate: [10, 0, -10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#test6", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          aware i’ve internalized productivity but not sure how to change that
        </motion.li>
        <motion.li
          id="text7"
          onHoverStart={() => {
            animate(
              "#text7",
              { rotate: [-10, 0, 10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text7", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          like my job but kind of having to resent working at all actually
        </motion.li>
        <motion.li
          id="text10"
          onHoverStart={() => {
            animate(
              "#text10",
              { rotate: [10, 0, -10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text10", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          wondering if the robots will take my job while annoyed they don’t do
          all the shitty stuff
        </motion.li>
        <motion.li
          id="text8"
          onHoverStart={() => {
            animate(
              "#text8",
              { rotate: [-10, 0, 10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text8", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          doing the same things so I need new worlds opened up to me
        </motion.li>
        <motion.li
          id="text9"
          onHoverStart={() => {
            animate(
              "#text9",
              { rotate: [10, 0, -10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text9", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          in disbelief some people actually take siestas and make food all the
          time
        </motion.li>
        <motion.li
          id="text11"
          onHoverStart={() => {
            animate(
              "#text11",
              { rotate: [-10, 0, 10, 0] },
              {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.1,
              }
            );
          }}
          onHoverEnd={() => animate("#text9", { rotate: 0 })}
          className="px-4 py-2 text-xl my-2 rounded bg-yellow-100 text-black inline-block"
        >
          fed up with the endless ridiculousness of so many internet corners
        </motion.li>
      </ul>
    </div>
  );
};

export default MadTexts;
