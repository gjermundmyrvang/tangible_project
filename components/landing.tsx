import { ArrowBigDown } from "lucide-react";
import React from "react";

export default function Landing() {
  return (
    <section
      id="landing"
      className="bg-black relative flex h-screen items-center justify-center overflow-hidden text-white"
    >
      <div className="relative text-center">
        <h1 className="animate-float bg-linear-to-b from-white to-white/60 bg-clip-text text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.9] tracking-tight text-transparent">
          TANGIBLE PROJECT
        </h1>

        <p className="mt-10 text-xl text-white/60">
          Interaction made physical.
        </p>

        <div className="absolute left-1/2 -bottom-30 -translate-x-1/2 text-sm text-white/40 animate-bounce">
          <span>Scroll to explore</span>
          <ArrowBigDown />
        </div>
      </div>
    </section>
  );
}
