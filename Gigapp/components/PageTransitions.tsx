"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
// https://dribbble.com/shots/26195744-Marketing-Agency-Website-Contact-Us-Page
// https://dribbble.com/shots/23071170-Contact-Us-Support-Page-Design-of-Digital-Agency
import PTbutton from "./buttons/PTbutton";
const PageTransitions = () => {
  const [activePage, setActivePage] = useState("1");

  return (
    <div className="w-full box-border flex justify-center items-center h-[100vh]">
      <AnimatePresence mode="wait">
        {activePage == "1" ? (
          <motion.div
            key={"1"}
            initial="initialState"
            animate="animateState"
            exit="exitState"
            transition={{
              duration: 0.75,
            }}
            variants={{
              initialState: {
                opacity: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              animateState: {
                opacity: 1,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              exitState: {
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
              },
            }}
            className="h-[100vh] text-2xl bg-emerald-400 w-full flex flex-col justify-center items-center"
          >
            <div className="text-2xl my-3">Page Transition Demo</div>
            <div onClick={() => setActivePage("2")} className="">
              <PTbutton progress={`Go To page no :  ${activePage}`} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={"2"}
            initial="initialState"
            animate="animateState"
            exit="exitState"
            transition={{
              duration: 0.75,
            }}
            variants={{
              initialState: {
                opacity: 0,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              animateState: {
                opacity: 1,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              },
              exitState: {
                clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
              },
            }}
            className="h-[100vh] text-2xl bg-emerald-400 w-[100vw] flex flex-col justify-center items-center"
          >
            <div className="text-2xl my-3">Page Transition Demo</div>
            <div onClick={() => setActivePage("1")} className="">
              <PTbutton progress={`Go To page no :  ${activePage}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageTransitions;
