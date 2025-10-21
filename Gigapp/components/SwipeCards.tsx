"use client";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  PanInfo,
  useAnimation,
  MotionTransform,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react";
import "../styles/swipecards.css";

const cards = [
  "https://res.cloudinary.com/tanviranjum/image/upload/v1758718534/websiteThree2_e75opo.jpg",
  "https://res.cloudinary.com/tanviranjum/image/upload/v1758718531/websiteThree1_l6yjwp.jpg",
  "https://res.cloudinary.com/tanviranjum/image/upload/v1758718531/website4_rxbdhq.jpg",
  "https://res.cloudinary.com/tanviranjum/image/upload/v1758718529/website3_nflnyu.jpg",
  "https://res.cloudinary.com/tanviranjum/image/upload/v1758718531/website1_ug5vhd.jpg",
  "https://res.cloudinary.com/tanviranjum/image/upload/v1758718536/website2_g9z5ag.jpg",
];

const transition = { type: "spring", stiffness: 300, damping: 50 };

const item: {
  enter: {
    x: number;
    y: number;
    scale: number;
    rotateY: number;
    rotateZ: number;
  };
  main: (i: number) => {
    x: number;
    y: number;
    scale: number;
    rotateY: number;
    rotateZ: number;
  };
} = {
  enter: {
    x: 0,
    y: -1000,
    scale: 1.5,
    rotateY: 0,
    rotateZ: 0,
  },
  main: (i: number) => {
    const rotate = -10 + Math.random() * 20;
    return {
      x: 0,
      y: i * -4,
      scale: 1,
      rotateY: rotate / 10,
      rotateZ: rotate,
      transition: { ...transition, type: "spring", delay: 1 + i * 0.1 },
    };
  },
};

const constraints = { top: 0, right: 0, bottom: 0, left: 0 };

const swipeForce = 5;

const swipeThreshold = 5000;

const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

// prettier-ignore
const transform = ({ x, y, scale, rotateY, rotateZ }: MotionTransform) => `perspective(1500px) rotateX(30deg) rotateY(${rotateY}) rotateZ(${rotateZ}) scale(${scale}) translateX(${x}) translateY(${y})`

function CardDesk() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0.2, 0.4], [-90, 0]);

  const containerMargin = useTransform(
    scrollYProgress,
    [0, 1],
    ["0px", "40px"]
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.5) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  });
  const controls = useAnimation();
  const gone = useRef(new Set()).current;

  const onDragEnd = async (index: number, { offset, velocity }: PanInfo) => {
    const swipeX = swipePower(offset.x, velocity.x);
    const swipeY = swipePower(offset.y, velocity.y);

    // If the strength of the swipe is not high enough, return
    // since each card has the dragConstraints set, the card
    // will animate back to its original position
    if (Math.abs(swipeX) < swipeThreshold && Math.abs(swipeY) < swipeThreshold)
      return;

    // Keep track of cards that are dismissed
    gone.add(index);

    // Animate the card away from the stack, using the offset
    // of the drag multiplied by a force factor.
    // This will slide the card away from the  stack
    await controls.start((i: number) => {
      if (index !== i) return {}; // We're only interested in animating the current card
      return {
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 50,
        },
        x: offset.x * swipeForce,
        y: offset.y * swipeForce,
      };
    });

    // If all cards are gone, simple rebuild the card stack after some delay has passed
    if (gone.size === cards.length) {
      gone.clear();
      await controls.start(item.main);
    }
  };

  // Run the enter animation only once the component is mounted
  // This is kind of what the variants API does, but we can't use
  // variants here since we want the custom controls, thus, we
  // mock what the variants API does and just animate from the
  // enter animation to the main animation.
  useEffect(() => {
    async function startAnimation() {
      await controls.start(item.enter);
      await controls.start(item.main);
    }
    startAnimation();
  }, []);

  return (
    <div>
      <motion.div
        ref={container}
        style={{
          margin: containerMargin,
        }}
        className="bg swipecontainer rounded-2xl flex justify-between p-10 items-center"
      >
        <div className="flex flex-col items-center mx-5">
          <div className="text-4xl">
            Your well-being
            <span
              style={{
                fontSize: "3rem",
                position: "relative",
                fontWeight: "bold",
                lineHeight: 1.2,
                background: "linear-gradient(90deg, #FF0080, #7928CA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Journey
            </span>
          </div>
          <div className="text-2xl">is a race not a sprint</div>
        </div>
        {/* Simply map over the number of cards and them. 
          Each card is positioned absolute and centered on the 
          screen so the cards stack. */}
        <div className="w-full">
          {Array(cards.length)
            .fill(null)
            .map((_, i) => (
              <div key={i + 10}>
                {/* This is the card itself. We use the index as a `key` for the element
                  and also inject it as `custom` property so we know which is which.
                  Additionally, we provide our custom constrols to the `animate` prop 
                  to manipulate the animation. We also provide a custom `transformTemplate`
                  to include a perspective transform which is useful for a kind of 3D-Look.
                  We enable `drag` on the element and set the `dragConstraints` to all zero
                  while the `dragElastic` prop is 1. Thus, we can freely drag the item however
                  we want, but in case or swipe is not strong enough, it will snap back into 
                  its original place. We also set the background to some image and 
                  animate the scale while we tap the element to simulate that we pick the element up. */}
                <motion.div
                  key={i}
                  custom={i}
                  className="card"
                  animate={controls}
                  transformTemplate={transform}
                  drag
                  dragElastic={1}
                  dragConstraints={constraints}
                  onDragEnd={(_, info) => onDragEnd(i, info)}
                  style={{ backgroundImage: `url(${cards[i]})` }}
                  whileTap={{ scale: 1.1 }}
                />
              </div>
            ))}
        </div>
        <div className="flex flex-col justify-center items-center mx-5">
          <div className="text-4xl">
            Unlock your
            <span
              style={{
                fontSize: "3rem",
                position: "relative",
                fontWeight: "bold",
                lineHeight: 1.2,
                background: "linear-gradient(90deg, #FF0080, #7928CA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Potential
            </span>
            <div className="flex mt-10 items-center justify-center">
              <AnimatePresence mode="wait">
                {!isUnlocked && (
                  <motion.div
                    id="keySvg"
                    style={{
                      rotate,
                    }}
                    initial={{
                      scale: 0.7,
                      opacity: 0.5,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0.7,
                      opacity: 0.5,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    key={"svg rotation1"}
                    className="w-24"
                  >
                    <svg
                      width="75px"
                      height="75px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V14Z"
                        fill="#000000"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7 8.12037C5.3161 8.53217 4 9.95979 4 11.7692V17.3077C4 19.973 6.31545 22 9 22H15C17.6846 22 20 19.973 20 17.3077V11.7692C20 9.95979 18.6839 8.53217 17 8.12037V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V8.12037ZM15 7V8H9V7C9 6.64936 9.06015 6.31278 9.17071 6C9.58254 4.83481 10.6938 4 12 4C13.3062 4 14.4175 4.83481 14.8293 6C14.9398 6.31278 15 6.64936 15 7ZM6 11.7692C6 10.866 6.81856 10 8 10H16C17.1814 10 18 10.866 18 11.7692V17.3077C18 18.7208 16.7337 20 15 20H9C7.26627 20 6 18.7208 6 17.3077V11.7692Z"
                        fill="#000000"
                      />
                    </svg>
                  </motion.div>
                )}

                {isUnlocked && (
                  <motion.div
                    initial={{
                      scale: 0.7,
                      opacity: 0.5,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0.7,
                      opacity: 0.5,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    id="unlockSvg"
                    className="w-15 "
                  >
                    <svg
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 253.334 253.334"
                      // style="enable-background:new 0 0 253.334 253.334;"
                      xmlSpace="preserve"
                    >
                      <g>
                        <path
                          d="M160.44,89.902H74.524V52.345C74.524,34.51,89.034,20,106.87,20s32.346,14.51,32.346,32.345V62.57c0,5.523,4.478,10,10,10
		s10-4.477,10-10V52.345C159.215,23.482,135.733,0,106.87,0S54.524,23.482,54.524,52.345v37.557h-1.225
		c-15.244,0-27.646,12.402-27.646,27.646v106.908c0,15.923,12.954,28.878,28.878,28.878h104.678
		c15.924,0,28.878-12.955,28.878-28.878V117.548C188.087,102.304,175.684,89.902,160.44,89.902z M168.087,224.456
		c0,4.896-3.982,8.878-8.878,8.878H54.531c-4.896,0-8.878-3.982-8.878-8.878V117.548c0-4.216,3.431-7.646,7.646-7.646H160.44
		c4.216,0,7.646,3.43,7.646,7.646V224.456z"
                        />
                        <path
                          d="M106.87,134.44c-11.409,0-20.691,9.282-20.691,20.691c0,7.783,4.324,14.57,10.691,18.102v25.562c0,5.523,4.478,10,10,10
		s10-4.477,10-10v-25.562c6.368-3.532,10.691-10.319,10.691-18.102C127.561,143.722,118.279,134.44,106.87,134.44z"
                        />
                        <path
                          d="M178.588,54.182c1.221,0.49,2.48,0.721,3.72,0.721c3.965,0,7.718-2.375,9.284-6.28l7.445-18.563
		c2.056-5.126-0.433-10.948-5.559-13.004c-5.125-2.056-10.948,0.433-13.004,5.559l-7.445,18.563
		C170.974,46.304,173.462,52.125,178.588,54.182z"
                        />
                        <path
                          d="M190.093,66.501c1.623,3.796,5.317,6.071,9.2,6.071c1.312,0,2.645-0.259,3.926-0.808l18.39-7.862
		c5.078-2.171,7.436-8.047,5.265-13.126c-2.172-5.078-8.052-7.436-13.126-5.264l-18.39,7.862
		C190.28,55.546,187.922,61.422,190.093,66.501z"
                        />
                        <path
                          d="M221.085,85.232l-18.563-7.445c-5.126-2.056-10.948,0.432-13.004,5.559c-2.056,5.126,0.433,10.948,5.559,13.004
		l18.563,7.445c1.221,0.49,2.48,0.721,3.72,0.721c3.965,0,7.718-2.375,9.284-6.28C228.699,93.11,226.211,87.288,221.085,85.232z"
                        />
                      </g>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      {/* <div className="h-[100vh] bg-orange-400 mt-[100vh]"></div> */}
    </div>
  );
}

export default CardDesk;
