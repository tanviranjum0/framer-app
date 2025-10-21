"use client";
import React, { useState, useRef, MouseEvent } from "react";
import { motion } from "motion/react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const LiquidRippleButton = ({ inText }: { inText: string }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(0);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();

    // Calculate position and size of ripple
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Add new ripple
    const newRipple = {
      id: nextId.current++,
      x,
      y,
      size,
    };
    console.log(newRipple);
    setRipples((prev) => [...prev, newRipple]);
  };

  const clearRipple = (id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  return (
    <div>
      <motion.button
        className="bg-linear-65 from-teal-200 to-teal-400"
        ref={buttonRef}
        style={styles.button}
        onClick={createRipple}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {inText}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            style={{
              ...styles.ripple,
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => clearRipple(ripple.id)}
          />
        ))}
      </motion.button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    position: "relative",
    overflow: "hidden",
    padding: "16px 32px",
    // backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#185a9d",
    width: "15rem",
    border: "none",
    borderRadius: "50px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
  },
  ripple: {
    position: "absolute",
    borderRadius: "50%",
    // backgroundColor: "rgba(255, 255, 255, 1)",
    backgroundColor: "rgba(0,0,0,0.5)",
    transform: "scale(0)",
    pointerEvents: "none",
  },
};

export default LiquidRippleButton;
