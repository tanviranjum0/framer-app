"use client";
import Image from "next/image";
import { motion } from "motion/react";
import logo from "@/public/logo3.png";
import { useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  useEffect(() => {
    const displayTime = document.querySelector(".display-time") as HTMLElement;
    function getTime() {
      const time = new Date();
      if (!displayTime) return;
      displayTime.innerText = time.toLocaleTimeString("en-US", {
        hour12: true,
      });
    }
    setInterval(() => {
      getTime();
    }, 1000);
  }, []);
  return (
    <div className="shadow-md overflow-hidden">
      <div className="flex py-5  justify-between mx-10">
        <div className="flex justify-center gap-10  items-center">
          <Link href={"/"}>
            <Image
              alt="logo"
              className="rounded-full cursor-pointer"
              src={logo}
              width={50}
              height={50}
            />
          </Link>
          <div className="hidden md:block">
            <div className="text-sm text-gray-300">Availability</div>
            <div className="flex justify-center items-center gap-2">
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
              <div>Available for work</div>
            </div>
          </div>

          <div className="">
            <div className="text-sm text-gray-300">Local Time</div>
            <div className="display-time"></div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm text-gray-300">City</div>
            <div className="">Chattogram, Bangladesh</div>
          </div>
        </div>
        <div className="justify-around gap-2 hidden md:flex items-center">
          <div className="btn2 px-3/2 w-24 py-1">Facebook</div>
          <div className="btn2 px-3/2 w-24 py-1">Linkedin</div>
          <div className="btn2 px-3/2 w-24 py-1">Fiverr</div>
          <div className="btn2 px-3/2 w-24 py-1">Github</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
