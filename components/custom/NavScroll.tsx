"use client";

import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import PillNav, { PillNavItem } from "@/components/reactbits/PillNav/PillNav";

type NavScrollProps = {
  logo?: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  /** Seberapa jauh scroll (px) untuk mencapai ukuran compact penuh */
  compactDistance?: number; // default 220
  /** Lebar maksimum saat compact (px atau %). Contoh "720px" */
  compactMaxWidth?: string; // default "720px"
  /** Lebar maksimum saat expanded (px atau %) */
  expandedMaxWidth?: string; // default "1152px" (≈ max-w-6xl)
  className?: string;
};

/**
 * Navbar yang melebar di top, lalu mengecil & center ketika scroll.
 * Tetap menggunakan PillNav untuk tombol (hover animasinya ikut).
 */
const NavScroll: React.FC<NavScrollProps> = ({
  logo = "/logo.svg",
  logoAlt = "Logo",
  items,
  activeHref,
  compactDistance = 220,
  compactMaxWidth = "720px",
  expandedMaxWidth = "1152px",
  className = "",
}) => {
  const { scrollY } = useScroll();

  // progress 0..1 berdasarkan jarak scroll
  const p = useTransform(scrollY, [0, compactDistance], [0, 1]);

  // Animasi ukuran & tampilan container
  const scale = useTransform(p, [0, 1], [1, 0.92]);
  const bgOpacity = useTransform(p, [0, 1], [0.15, 0.3]); // sedikit lebih solid saat compact
  const y = useTransform(p, [0, 1], [0, 2]); // geser kecil biar natural
  const radius = useTransform(p, [0, 1], [18, 24]);

  // Width transisi: dari expandedMaxWidth -> compactMaxWidth
  const width = useTransform(p, [0, 1], [expandedMaxWidth, compactMaxWidth]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000]">
      {/* background bar transparan */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-b border-white/10" />

      {/* nav shrink di tengah */}
      <motion.div
        style={{ width, scale, y, borderRadius: radius }}
        className="
        relative pointer-events-auto mx-auto mt-2
        transition-all duration-500
        shadow-[0_8px_28px_rgba(0,0,0,0.25)]
      "
      >
        <PillNav
          logo={logo}
          items={items}
          activeHref={activeHref}
          baseColor="#0A0A0D"
          pillColor="transparent"
          pillTextColor="#fff"
          hoveredPillTextColor="#fff"
          initialLoadAnimation={false}
        />
      </motion.div>
    </div>
  );
};

export default NavScroll;
