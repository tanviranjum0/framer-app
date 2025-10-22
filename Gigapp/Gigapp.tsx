"use client";
import React from "react";
import "./Gigapp.css";
import Navbar from "./components/Navbar";
import MarqueeComponent from "./components/MarqueeComponent";
import PseudoScroll from "./components/PseudoScroll";
import MadTexts from "./components/MadTexts";
import ScrollAnimatedImages from "./components/ScrollAnimatedImages";
import HiddenImages from "./components/HiddenImages";
import SwipeCards from "./components/SwipeCards";
import Carousel from "./components/Carousel";
import ImageTrail from "./components/ImageTrail";
import BackgroundRipple from "./components/BackgroundRipple";
import SpringControls from "./components/SpringControls";
import PageTransitions from "./components/PageTransitions";
import Footer from "./components/Footer";

const Gigapp = () => {
  return (
    <div className="bg-[#003631] text-white">
      <Navbar />
      <MarqueeComponent />
      <PseudoScroll />
      <MadTexts />
      <ScrollAnimatedImages />
      <HiddenImages />
      <SwipeCards />
      <Carousel />
      <ImageTrail />
      <BackgroundRipple />
      <SpringControls />
      <PageTransitions />
      <Footer />
    </div>
  );
};

export default Gigapp;
