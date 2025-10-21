"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { wrap } from "@popmotion/popcorn";
import "../styles/carousel.css";
import Image from "next/image";

// import { IMAGES } from "./Images";
const IMAGES = [
  {
    id: 0,
    imageSrc:
      "https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 1,
    imageSrc:
      "https://images.unsplash.com/photo-1725878746053-407492aa4034?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    imageSrc:
      "https://images.unsplash.com/photo-1757383747751-d1c91fb276ea?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    imageSrc:
      "https://images.unsplash.com/photo-1623841696408-10aec8ed6d44?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    imageSrc:
      "https://images.unsplash.com/photo-1565982369439-2072eee9168a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const sliderVariants = {
  incoming: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    scale: 1.2,
    opacity: 0,
  }),
  active: { x: 0, scale: 1, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    scale: 1,
    opacity: 0.2,
  }),
};

const sliderTransition: object = {
  duration: 1,
  ease: [0.56, 0.03, 0.12, 1.04] as Array<number>,
};

const Carousel = () => {
  const [[imageCount, direction], setImageCount] = useState([0, 0]);

  const activeImageIndex = wrap(0, IMAGES.length, imageCount);
  const swipeToImage = (swipeDirection: number) => {
    setImageCount([imageCount + swipeDirection, swipeDirection]);
  };

  const dragEndHandler = (dragInfo: PanInfo) => {
    const draggedDistance = dragInfo.offset.x;
    const swipeThreshold = 50;
    if (draggedDistance > swipeThreshold) {
      swipeToImage(-1);
    } else if (draggedDistance < -swipeThreshold) {
      swipeToImage(1);
    }
  };

  const skipToImage = (imageId: number) => {
    const changeDirection =
      imageId > activeImageIndex ? 1 : imageId < activeImageIndex ? -1 : 0;
    setImageCount([imageId, changeDirection]);
  };

  const leftcount = wrap(0, IMAGES.length, imageCount - 1);
  const rightcount = wrap(0, IMAGES.length, imageCount + 1);

  return (
    <main className="bg-[#dfdad5] flex flex-col items-center">
      <div className="slider-container flex flex-col items-center my-6 relative overflow-hidden h-[500px] w-full">
        <div className="flex items-center">
          <div className="slider relative blur-xs -right-20 overflow-hidden h-[300px] w-[400px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={imageCount}
                style={{
                  backgroundImage: `url(${IMAGES[leftcount].imageSrc})`,
                }}
                custom={direction}
                variants={sliderVariants}
                initial="incoming"
                animate="active"
                exit="exit"
                transition={sliderTransition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, dragInfo) => dragEndHandler(dragInfo)}
                className="image"
              />
            </AnimatePresence>
          </div>
          <div className="slider relative z-10 shadow-2xl shadow-black overflow-hidden h-[400px] w-[700px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={imageCount}
                style={{
                  backgroundImage: `url(${IMAGES[activeImageIndex].imageSrc})`,
                }}
                custom={direction}
                variants={sliderVariants}
                initial="incoming"
                animate="active"
                exit="exit"
                transition={sliderTransition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, dragInfo) => dragEndHandler(dragInfo)}
                className="image"
              />
            </AnimatePresence>
          </div>
          <div className="slider  blur-xs -left-20 relative overflow-hidden h-[300px] w-[400px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={imageCount}
                style={{
                  backgroundImage: `url(${IMAGES[rightcount].imageSrc})`,
                }}
                custom={direction}
                variants={sliderVariants}
                initial="incoming"
                animate="active"
                exit="exit"
                transition={sliderTransition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, dragInfo) => dragEndHandler(dragInfo)}
                className="image"
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="buttons">
          <button onClick={() => swipeToImage(-1)}>←</button>
          <button onClick={() => swipeToImage(1)}>→</button>
        </div>
      </div>

      <div className="thumbnails">
        {IMAGES.map((image) => (
          <div
            key={image.id}
            onClick={() => skipToImage(image.id)}
            className="thumbnail-container"
          >
            <Image
              width={1000}
              height={1000}
              src={image.imageSrc}
              alt="Musician"
            />
            <div
              className={`active-indicator ${
                image.id === activeImageIndex ? "active" : null
              }`}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default Carousel;
