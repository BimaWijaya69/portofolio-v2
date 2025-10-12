"use client";
import { motion, Variants } from "framer-motion";

const waveVariants: Variants = {
  initial: {
    scaleY: 0,
    originY: "bottom",
    backgroundColor: "#C6F10E",
  },
  hover: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.05, -0.01, 0.9], // Pastikan ini adalah array 4 angka
    },
  },
};

export default function AnimatedButton() {
  return (
    <motion.button
      className="
        relative px-8 py-3 rounded-full overflow-hidden
        bg-black text-[#C6F10E] font-semibold
        border-2 border-[#C6F10E]
        group
      "
      whileHover="hover"
      initial="initial"
    >
      <motion.div className="absolute inset-0 z-0" variants={waveVariants} />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
        My Resume
      </span>
    </motion.button>
  );
}
