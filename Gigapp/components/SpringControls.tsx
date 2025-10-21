"use client";
import React, { useEffect, useRef, useState } from "react";
import { DualRangeSlider } from "./packages/DualRangeSlider";
import { FaCopy } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { motion, useAnimate, useScroll, useTransform } from "motion/react";
interface SDMTypes {
  type: "spring";
  stiffness: number;
  mass: number;
  damping: number;
  velocity: number;
  restDelta: number;
  restSpeed: number;
}
const SpringControls = () => {
  const isFirstRender = useRef<boolean>(true);
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftSection, setLeftSection] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const containerMargin = useTransform(
    scrollYProgress,
    [0, 1],
    ["0px", "50px"]
  );
  const [alreadyAnimated, setAlreadyAnimated] = useState<boolean>(false);
  const [db, setDb] = useState<{
    bounce: number;
    duration: number;
  }>({
    bounce: 0.25,
    duration: 0.8,
  });
  const [sdm, setSdm] = useState<SDMTypes>({
    type: "spring",
    stiffness: 100,
    mass: 1,
    damping: 10,
    velocity: 0,
    restDelta: 0.01,
    restSpeed: 0.01,
  });
  const handleCopyControls = () => {
    const divElement = document.getElementById(
      "copiableControlsDiv"
    ) as HTMLDivElement;

    // Create a temporary textarea element
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = divElement.innerText; // Get the plain text content

    // Append the textarea to the document (it doesn't need to be visible)
    document.body.appendChild(tempTextarea);

    // Select the text in the textarea
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand("copy");

    // Remove the temporary textarea
    document.body.removeChild(tempTextarea);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
    // alert("Text copied to clipboard!"); // Optional: Provide user feedback
  };

  const toggleAnimation = () => {
    if (leftSection) {
      if (alreadyAnimated) {
        animate(
          "#leftRightMovingBox",
          { left: "0%" },
          { duration: db.duration, type: "spring", bounce: db.bounce }
        );
        animate(
          "#scalingBox",
          { scale: 0.3 },
          { duration: db.duration, type: "spring", bounce: db.bounce }
        );
        animate(
          "#rotatingBox",
          { rotate: 0 },
          { duration: db.duration, type: "spring", bounce: db.bounce }
        );
        setAlreadyAnimated(false);
      } else {
        animate(
          "#leftRightMovingBox",
          { left: "calc(100% - 4rem)" },
          { duration: db.duration, type: "spring", bounce: db.bounce }
        );
        animate(
          "#scalingBox",
          { scale: 1 },
          { duration: db.duration, type: "spring", bounce: db.bounce }
        );
        animate(
          "#rotatingBox",
          { rotate: 360 },
          { duration: db.duration, type: "spring", bounce: db.bounce }
        );
        setAlreadyAnimated(true);
      }
    }
    if (!leftSection) {
      if (alreadyAnimated) {
        animate("#leftRightMovingBox", { left: "0%" }, sdm);
        animate("#scalingBox", { scale: 0.3 }, sdm);
        animate("#rotatingBox", { rotate: 0 }, sdm);
        setAlreadyAnimated(false);
      } else {
        animate("#leftRightMovingBox", { left: "calc(100% - 4rem)" }, sdm);
        animate("#scalingBox", { scale: 1 }, sdm);
        animate("#rotatingBox", { rotate: 360 }, sdm);
        setAlreadyAnimated(true);
      }
    }
  };
  useEffect(() => {
    if (!leftSection) {
      setLeftSection(true);
    }
    if (!alreadyAnimated) {
      animate(
        "#leftRightMovingBox",
        { left: "calc(100% - 4rem)" },
        { duration: db.duration, type: "spring", bounce: db.bounce }
      );
      animate(
        "#scalingBox",
        { scale: 1 },
        { duration: db.duration, type: "spring", bounce: db.bounce }
      );
      animate(
        "#rotatingBox",
        { rotate: 360 },
        { duration: db.duration, type: "spring", bounce: db.bounce }
      );
      setAlreadyAnimated(true);
      return;
    }
    if (alreadyAnimated) {
      animate(
        "#leftRightMovingBox",
        { left: "0%" },
        { duration: db.duration, type: "spring", bounce: db.bounce }
      );
      animate(
        "#scalingBox",
        { scale: 0.3 },
        { duration: db.duration, type: "spring", bounce: db.bounce }
      );
      animate(
        "#rotatingBox",
        { rotate: 0 },
        { duration: db.duration, type: "spring", bounce: db.bounce }
      );
      setAlreadyAnimated(false);
      return;
    }
  }, [db]);
  //Mass, Velocity, Stiffness
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (leftSection) {
      setLeftSection(false);
    }
    if (!alreadyAnimated) {
      animate("#leftRightMovingBox", { left: "calc(100% - 4rem)" }, sdm);
      animate("#scalingBox", { scale: 1 }, sdm);
      animate("#rotatingBox", { rotate: 360 }, sdm);
      setAlreadyAnimated(true);
    } else if (alreadyAnimated) {
      animate("#leftRightMovingBox", { left: "0%" }, sdm);
      animate("#scalingBox", { scale: 0.3 }, sdm);
      animate("#rotatingBox", { rotate: 0 }, sdm);
      setAlreadyAnimated(false);
    }
  }, [sdm]);

  return (
    <motion.div
      style={{
        margin: containerMargin,
      }}
      ref={containerRef}
    >
      <motion.div
        ref={scope}
        className="h-[100vh] rounded-2xl text-black p-10 bg-conic from-blue-600 to-sky-400 to-50%"
      >
        <div className="text-4xl my-3">Spring Setting</div>
        <div className="grid grid-cols-10 gap-4">
          <div
            onClick={toggleAnimation}
            className="bg-gray-300 w-full col-span-8 h-[10rem] p-[10px] rounded-xl"
          >
            <div className="flex relative">
              <motion.div
                initial={{
                  left: "0%",
                }}
                id="leftRightMovingBox"
                className="h-[4rem] relative w-[4rem] self-end  bg-radial from-pink-400 from-40% to-fuchsia-700 rounded"
              ></motion.div>
            </div>
            <div className="flex justify-between">
              <motion.span
                id="scalingBox"
                initial={{
                  scale: 0.3,
                }}
                className="h-[4rem] my-1 w-[4rem] bg-conic/decreasing from-violet-700 via-lime-300 to-violet-700 rounded"
              ></motion.span>
              <motion.span
                initial={{
                  rotate: 0,
                }}
                id="rotatingBox"
                className="h-[4rem] w-[4rem] bg-linear-to-t from-red-500 to-amber-500 rounded"
              ></motion.span>
            </div>
          </div>
          <div
            id="copiableControlsDiv"
            tabIndex={0}
            onKeyDown={(e) => {
              const isControlPressed = e.getModifierState("Control");
              const isAPressed = e.keyCode === 65;
              if (isControlPressed && isAPressed) {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();

                const sel = window.getSelection();
                const range = document.createRange(); // Range object
                range.selectNodeContents(e.target as HTMLDivElement); // Sets Range
                sel?.removeAllRanges(); // Remove all ranges from selection
                sel?.addRange(range); // Add Range to a Selection.
                // document.execCommand("copy"); // Copy the selected range
              }
            }}
            className="bg-gray-600 text-sm overflow-y-scroll overflow-x-hidden text-white p-[10px] h-[10rem] col-span-2 rounded-xl"
          >
            <div className="relative">
              {copied ? (
                <IoMdDoneAll
                  onClick={handleCopyControls}
                  className="opacity-50 hover:opacity-80 cursor-copy  absolute right-0 top-0 p-1 h-6 w-6"
                />
              ) : (
                <FaCopy
                  onClick={handleCopyControls}
                  className="opacity-50 hover:opacity-80 cursor-copy  absolute right-0 top-0 p-1 h-6 w-6"
                />
              )}
            </div>
            const transition = {"{"}
            <br></br>
            <div>type : &apso;spring&apso;,</div>
            <div> {sdm.stiffness !== 0 && `stiffness : ${sdm.stiffness},`}</div>
            <div> {sdm.mass !== 0 && `mass : ${sdm.mass},`}</div>
            <div> {sdm.damping !== 0 && `damping : ${sdm.damping},`}</div>
            <div> {sdm.velocity !== 0 && `velocity : ${sdm.velocity},`}</div>
            <div> {sdm.restDelta !== 0 && `restDelta : ${sdm.restDelta},`}</div>
            <div> {sdm.restSpeed !== 0 && `restSpeed : ${sdm.restSpeed},`}</div>
            {"}"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div onClick={() => setLeftSection(true)}>
            <div className="text-3xl my-2">Duration and Bounce</div>
            <div
              className={`border-2 p-3 ${
                leftSection && "border-4"
              } rounded-2xl`}
            >
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Duration</span>
                <div className="flex gap-4 col-span-10 ml-1">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[db.duration]}
                    onValueChange={([duration]) =>
                      setDb({
                        duration,
                        bounce: db.bounce,
                      })
                    }
                    min={0}
                    max={3}
                    step={0.03}
                  />
                </div>
              </div>
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Bounce</span>
                <div className="flex gap-4 col-span-10 ml-1">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[db.bounce]}
                    onValueChange={([bounce]) =>
                      setDb({
                        duration: db.duration,
                        bounce,
                      })
                    }
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => setLeftSection(false)} className="">
            <div className="text-3xl my-2">Stiffness, Damping, Mass...</div>
            <div
              className={`border-2 ${
                !leftSection && "border-4"
              }  p-3 rounded-2xl`}
            >
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Stiffness</span>
                <div className="flex gap-4 col-span-10 ml-2">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[sdm.stiffness]}
                    onValueChange={([stiffness]) =>
                      setSdm({
                        type: "spring",
                        stiffness,
                        mass: sdm.mass,
                        damping: sdm.damping,
                        velocity: sdm.velocity,
                        restDelta: sdm.restDelta,
                        restSpeed: sdm.restSpeed,
                      })
                    }
                    min={0}
                    max={300}
                    step={3}
                  />
                </div>
              </div>
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Damping</span>
                <div className="flex gap-4 col-span-10 ml-2">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[sdm.damping]}
                    onValueChange={([damping]) =>
                      setSdm({
                        type: "spring",
                        stiffness: sdm.stiffness,
                        mass: sdm.mass,
                        damping,
                        velocity: sdm.velocity,
                        restDelta: sdm.restDelta,
                        restSpeed: sdm.restSpeed,
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Mass</span>
                <div className="flex gap-4 col-span-10 ml-2">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[sdm.mass]}
                    onValueChange={([mass]) =>
                      setSdm({
                        type: "spring",
                        stiffness: sdm.stiffness,
                        mass,
                        damping: sdm.damping,
                        velocity: sdm.velocity,
                        restDelta: sdm.restDelta,
                        restSpeed: sdm.restSpeed,
                      })
                    }
                    min={0}
                    max={10}
                    step={0.1}
                  />
                </div>
              </div>
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Velocity</span>
                <div className="flex gap-4 col-span-10 ml-2">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[sdm.velocity]}
                    onValueChange={([velocity]) =>
                      setSdm({
                        type: "spring",
                        stiffness: sdm.stiffness,
                        mass: sdm.mass,
                        damping: sdm.damping,
                        velocity,
                        restDelta: sdm.restDelta,
                        restSpeed: sdm.restSpeed,
                      })
                    }
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>
              </div>
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Rest Delta</span>
                <div className="flex gap-4 col-span-10 ml-2">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[sdm.restDelta]}
                    onValueChange={([restDelta]) =>
                      setSdm({
                        type: "spring",
                        stiffness: sdm.stiffness,
                        mass: sdm.mass,
                        damping: sdm.damping,
                        velocity: sdm.velocity,
                        restDelta,
                        restSpeed: sdm.restSpeed,
                      })
                    }
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              </div>
              <div className="mx-5 grid grid-cols-12 py-1.5">
                <span className="col-span-2 font-semibold">Rest Speed</span>
                <div className="flex gap-4 col-span-10 ml-2">
                  <DualRangeSlider
                    label
                    lableContenPos={"left"}
                    value={[sdm.restSpeed]}
                    onValueChange={([restSpeed]) =>
                      setSdm({
                        type: "spring",
                        stiffness: sdm.stiffness,
                        mass: sdm.mass,
                        damping: sdm.damping,
                        velocity: sdm.velocity,
                        restDelta: sdm.restDelta,
                        restSpeed,
                      })
                    }
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div onClick={handleCopyControls}>Hello</div> */}
          <div className="text-lg">
            This component is inspired from https://framermotionexamples.com/{" "}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SpringControls;
