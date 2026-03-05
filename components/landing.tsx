import { ArrowBigDown } from "lucide-react";
import React from "react";

export default function Landing() {
  return (
    <section
      id="landing"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/disturbia.mp4" type="video/mp4" />
      </video>

      {/* Blur / dark overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/40" />

      {/* Content */}
      <div className="relative text-center px-6 text-white">
        <h1 className="animate-float bg-linear-to-b from-pink-200 to-pink-600 bg-clip-text text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.9] tracking-tight text-transparent uppercase">
          DISTURBIA
        </h1>

        <h2 className="mt-6 text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight text-white/80">
          Tangible Interaction Project
        </h2>

        <p className="mt-4 text-md md:text-lg text-white/60 max-w-xl mx-auto">
          Interaction made physical.
        </p>

        <div className="absolute left-1/2 -bottom-28 -translate-x-1/2 text-sm text-white/40 animate-bounce flex gap-2 items-center">
          <span>Scroll to explore</span>
          <ArrowBigDown />
        </div>
      </div>
    </section>
  );
}
