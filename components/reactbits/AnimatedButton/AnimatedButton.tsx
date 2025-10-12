"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export interface PillNavAnimatedButtonProps {
  label: string;
  href: string;
  ariaLabel?: string;
  className?: string;
  ease?: string;
  /** Warna dasar container (sama seperti baseColor di PillNav) */
  baseColor?: string; // default: #fff
  /** Warna pill */
  pillColor?: string; // default: #060010
  /** Warna text saat hover (kontras) */
  hoveredPillTextColor?: string; // default: #060010
  /** Warna text default di pill */
  pillTextColor?: string; // default mengikuti baseColor
  /** Jalankan animasi load awal (width reveal) */
  initialLoadAnimation?: boolean;
}

const isExternal = (href: string) =>
  /^(https?:\/\/|\/\/|mailto:|tel:|#)/i.test(href);

const PillNavAnimatedButton: React.FC<PillNavAnimatedButtonProps> = ({
  label,
  href,
  ariaLabel,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;

  // refs untuk animasi hover
  const circleRef = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // layout & timeline setup
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle?.parentElement) return;

    const pill = circle.parentElement as HTMLElement;
    const rect = pill.getBoundingClientRect();
    const { width: w, height: h } = rect;

    // geometri lingkaran agar menutup pill (sama rumusnya)
    const R = ((w * w) / 4 + h * h) / (2 * h);
    const D = Math.ceil(2 * R) + 2;
    const delta =
      Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
    const originY = D - delta;

    circle.style.width = `${D}px`;
    circle.style.height = `${D}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle, {
      xPercent: -50,
      scale: 0,
      transformOrigin: `50% ${originY}px`,
    });

    const labelEl = pill.querySelector<HTMLElement>(".pill-label");
    const whiteEl = pill.querySelector<HTMLElement>(".pill-label-hover");

    if (labelEl) gsap.set(labelEl, { y: 0 });
    if (whiteEl) {
      gsap.set(whiteEl, { y: h + 12, opacity: 0 });
      gsap.set(whiteEl, { y: Math.ceil(h + 100), opacity: 0 });
    }

    tlRef.current?.kill();
    const tl = gsap.timeline({ paused: true });

    tl.to(
      circle,
      { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
      0
    );
    if (labelEl)
      tl.to(labelEl, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
    if (whiteEl)
      tl.to(
        whiteEl,
        { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
        0
      );

    tlRef.current = tl;

    const onResize = () => {
      // recompute on resize
      const rect2 = pill.getBoundingClientRect();
      const { width: w2, height: h2 } = rect2;
      const R2 = ((w2 * w2) / 4 + h2 * h2) / (2 * h2);
      const D2 = Math.ceil(2 * R2) + 2;
      const delta2 =
        Math.ceil(R2 - Math.sqrt(Math.max(0, R2 * R2 - (w2 * w2) / 4))) + 1;
      const originY2 = D2 - delta2;

      circle.style.width = `${D2}px`;
      circle.style.height = `${D2}px`;
      circle.style.bottom = `-${delta2}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY2}px`,
      });

      if (labelEl) gsap.set(labelEl, { y: 0 });
      if (whiteEl) gsap.set(whiteEl, { y: Math.ceil(h2 + 100), opacity: 0 });

      tlRef.current?.kill();
      const tl2 = gsap.timeline({ paused: true });
      tl2.to(
        circle,
        { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
        0
      );
      if (labelEl)
        tl2.to(
          labelEl,
          { y: -(h2 + 8), duration: 2, ease, overwrite: "auto" },
          0
        );
      if (whiteEl)
        tl2.to(
          whiteEl,
          { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
          0
        );
      tlRef.current = tl2;
    };

    window.addEventListener("resize", onResize);

    // animasi load awal: width reveal
    if (initialLoadAnimation && wrapperRef.current) {
      const navLike = wrapperRef.current;
      gsap.set(navLike, { width: 0, overflow: "hidden" });
      gsap.to(navLike, { width: "auto", duration: 0.6, ease });
    }

    return () => {
      window.removeEventListener("resize", onResize);
      tlRef.current?.kill();
      activeTweenRef.current?.kill();
    };
  }, [ease, initialLoadAnimation, label]);

  const handleEnter = () => {
    const tl = tlRef.current;
    if (!tl) return;
    activeTweenRef.current?.kill();
    activeTweenRef.current = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    const tl = tlRef.current;
    if (!tl) return;
    activeTweenRef.current?.kill();
    activeTweenRef.current = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
    ["--nav-h"]: "42px",
    ["--pill-pad-x"]: "18px",
  } as React.CSSProperties;

  const basePillClasses =
    "relative overflow-hidden inline-flex items-center justify-center h-[42px] no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0";

  const pillStyle: React.CSSProperties = {
    background: "var(--pill-bg, #fff)",
    color: "var(--pill-text, var(--base, #000))",
    paddingLeft: "var(--pill-pad-x)",
    paddingRight: "var(--pill-pad-x)",
  };

  const PillContent = (
    <>
      <span
        className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
        style={{ background: "var(--base, #000)", willChange: "transform" }}
        aria-hidden="true"
        ref={circleRef}
      />
      <span className="label-stack relative inline-block leading-[1] z-[2]">
        <span
          className="pill-label relative z-[2] inline-block leading-[1]"
          style={{ willChange: "transform" }}
        >
          {label}
        </span>
        <span
          className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
          style={{
            color: "var(--hover-text, #fff)",
            willChange: "transform, opacity",
          }}
          aria-hidden="true"
        >
          {label}
        </span>
      </span>
    </>
  );

  // Link internal Next vs eksternal
  const LinkInner = (
    <span
      className={basePillClasses}
      style={pillStyle}
      aria-label={ariaLabel || label}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {PillContent}
    </span>
  );

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full px-[3px] py-[3px] ${
        className || ""
      }`}
      style={{ ...cssVars, background: "var(--base, #000)" }}
      ref={wrapperRef}
    >
      {isExternal(href) ? (
        <a href={href}>{LinkInner}</a>
      ) : (
        <Link href={href}>{LinkInner}</Link>
      )}
    </div>
  );
};

export default PillNavAnimatedButton;
