import React from "react";

type Step = {
  title: string;
  text: string;
};

type NarrativeFlowProps = {
  title: string;
  description: string;
  steps: Step[];
};

export function Narrative({ title, description, steps }: NarrativeFlowProps) {
  return (
    <section className="w-full text-white py-4">
      <div className="mx-auto grid h-screen max-w-7xl grid-cols-1 gap-16 px-8 md:grid-cols-2 md:items-center">
        {/* Left Side */}
        <div>
          <h2 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-tight">
            {title}
          </h2>
          <p className="mt-10 max-w-xl text-xl text-white/70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-10">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-10">
              {/* Number */}
              <div className="absolute left-0 top-0 text-sm text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Step Content */}
              <h3 className="text-2xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-white/70 leading-relaxed">{step.text}</p>

              {/* Divider */}
              {i !== steps.length - 1 && (
                <div className="mt-6 h-px w-full bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
