"use client";
import { cn } from "@/lib/utils";
import Marquee from "react-fast-marquee";
import arrow from "@/public/imageTrail/arrow.png";
import badminton from "@/public/imageTrail/badminton.png";
import basketball from "@/public/imageTrail/basketball.png";
import boxing from "@/public/imageTrail/boxing.png";
import cricket from "@/public/imageTrail/cricket.png";
import cycle from "@/public/imageTrail/cycle.png";
import football from "@/public/imageTrail/football.png";
import golf from "@/public/imageTrail/golf.png";
import gym from "@/public/imageTrail/gym.png";
import hiking from "@/public/imageTrail/hiking.png";
import run from "@/public/imageTrail/run.png";
import skete from "@/public/imageTrail/skete.png";

import { createRef, MouseEvent, ReactNode, useRef } from "react";
import { StaticImageData } from "next/image";
import Image from "next/image";
interface ImageMouseTrailProps {
  items: (string | StaticImageData)[];
  children?: ReactNode;
  className?: string;
  imgClass?: string;
  distance?: number;
  maxNumberOfImages?: number;
  fadeAnimation?: boolean;
}
const textsMain = [
  "React",
  "Node.js",
  "Framer Motion",
  "Tailwind",
  "Bitcoin",
  "Etherum",
  "Dogecoin",
];
const images = [
  arrow,
  badminton,
  basketball,
  boxing,
  cricket,
  cycle,
  football,
  golf,
  gym,
  hiking,
  run,
  skete,
];

function ImageMouseTrail({
  items,
  children,
  maxNumberOfImages = 10,
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()));
  const currentZIndexRef = useRef(1);

  let globalIndex = 0;
  let last = { x: 0, y: 0 };

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef?.current?.getBoundingClientRect();
    const relativeX = x - (containerRect?.left ?? 0);
    const relativeY = y - (containerRect?.top ?? 0);
    image.style.left = `${relativeX}px`;
    image.style.top = `${relativeY}px`;
    console.log(refs.current[refs.current?.length - 1]);

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1;
    }
    image.style.zIndex = String(currentZIndexRef.current);
    currentZIndexRef.current++;

    image.dataset.status = "active";
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive";
      }, 1500);
    }
    last = { x, y };
  };

  const distanceFromLast = (x: number, y: number) => {
    return Math.hypot(x - last.x, y - last.y);
  };
  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive";
  };

  const handleOnMove = (e: MouseEvent) => {
    if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex % refs.current.length].current;
      const tail =
        refs.current[(globalIndex - maxNumberOfImages) % refs.current.length]
          ?.current;

      if (lead) activate(lead, e.clientX, e.clientY);
      if (tail) deactivate(tail);
      globalIndex++;
    }
  };

  return (
    <section onMouseMove={handleOnMove} ref={containerRef}>
      {items.map((item, index) => (
        <>
          <Image
            key={index + "imageImageMouseTrail"}
            className={cn(
              "object-fit rounded-2xl border-2 border-black  scale-0 opacity:0 data-[status='active']:scale-100 data-[status='active']:opacity-100 transition-transform data-[status='active']:duration-500 duration-300 data-[status='active']:ease-out-expo absolute -translate-y-[50%] max-h-40 max-w-fit -translate-x-[50%] "
            )}
            height={1000}
            width={1000}
            data-index={index}
            data-status="active"
            src={item}
            alt={`image-${index}`}
            ref={refs.current[index]}
          />
        </>
      ))}
      {children}
    </section>
  );
}

function ImageTrail() {
  return (
    <section>
      <div className="h-[100vh] relative m-10 rounded-2xl bg-amber-300">
        <ImageMouseTrail
          items={images}
          maxNumberOfImages={10}
          distance={25}
          imgClass="sm:w-40 w-28 sm:h-48 h-36"
        >
          <div className="h-[100vh] overflow-hidden rounded-2xl select-none font-boldonse bg-gray-200">
            <Marquee
              direction="right"
              className="marquee uppercase font-extrabold overflow-hidden "
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={`texts1-${index}`}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden "
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={`texts2-${index}`}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden"
              direction="right"
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={`texts3-${index}`}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden"
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={`texts4-${index}`}
                    className="mx-8 text-gray-300 font-extrabold text-9xl leading-40 tracking-wide "
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>{" "}
            <Marquee
              className="marquee uppercase font-extrabold overflow-hidden"
              direction="right"
              autoFill={true}
              speed={20}
            >
              {textsMain.map((text, index) => {
                return (
                  <span
                    key={`texts3-${index}`}
                    className="mx-8 text-gray-300 text-9xl leading-40 tracking-wide"
                  >
                    {text}
                  </span>
                );
              })}
            </Marquee>
            <div className="h-[50vh] m-10 z-10 relative -top-[80vh]">
              <div className="my-5">
                <div className="text-7xl text-black leading-32 tracking-wider">
                  The Pros Train
                </div>
                <div className="text-7xl  tracking-wider">
                  <span className="text-black">with</span>{" "}
                  <span className="text-sky-500">Plates</span>
                </div>
              </div>
              <div className="font-sans text-black text-xl font-bold">
                <div className="">
                  He was still too young to know that the heart&apos;s memory
                  eliminates
                </div>
                <div className="">
                  the bad and magnifies the good, and that thanks to this
                  artifice
                </div>
                <div className="">
                  we manage to endure the burden of the past.
                </div>
              </div>
            </div>
          </div>
        </ImageMouseTrail>
      </div>
    </section>
  );
}

export default ImageTrail;
