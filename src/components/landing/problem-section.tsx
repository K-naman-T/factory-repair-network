"use client"

import { Factory, Ban, Warehouse } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

const painPoints = [
  {
    icon: Factory,
    title: "Multi-day production halts",
    description: "Every hour of downtime costs factories lakhs in lost production. Traditional repair channels take 3-7 days.",
  },
  {
    icon: Ban,
    title: "No on-demand marketplace exists",
    description: "Factory owners rely on word-of-mouth or contractors, with no way to compare, review, or track technicians.",
  },
  {
    icon: Warehouse,
    title: "Small manufacturers suffer most",
    description: "Without dedicated maintenance teams, small and medium factories face the longest downtimes.",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-[#141210] py-20 md:py-28 relative text-[#e8e4de]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-[#d4782a]/30 bg-[#d4782a]/5 px-4 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-[#d4782a]">
              The Problem
            </span>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <div className="mt-4 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#e8e4de] md:text-4xl">
              Industrial repair in India is{" "}
              <span className="text-[#c62828]">broken</span>
            </h2>
            <p className="mt-4 text-lg text-[#9e9790]">
              Factory equipment breaks down daily, yet there&apos;s no organized way to find, vet, and dispatch repair technicians.
            </p>
          </div>
        </BlurFade>

        <div className="mt-6 mx-auto max-w-lg text-center">
          <BlurFade inView delay={0.15}>
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#2a2620] bg-[#1e1b17] px-6 py-3">
              <span className="text-3xl font-bold text-[#d4782a]">78.5</span>
              <div className="text-left">
                <p className="text-sm font-medium text-[#e8e4de]">Severity Score</p>
                <p className="text-xs text-[#9e9790]">Razorpay FixMyItch Index</p>
              </div>
            </div>
          </BlurFade>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((point, i) => (
            <BlurFade key={point.title} inView delay={0.2 + i * 0.1}>
              <div className="group relative overflow-hidden rounded-[12px] border border-[#2a2620] bg-[#1e1b17] p-6 h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d4782a]/10 text-[#d4782a]">
                  <point.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#e8e4de]">{point.title}</h3>
                <p className="mt-2 text-sm text-[#9e9790]">{point.description}</p>
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade inView delay={0.5} className="mt-12">
          <div className="relative overflow-hidden rounded-[12px]">
            <img
              src="/images/mechanic-helmet.jpg"
              alt="Factory worker needing urgent repair"
              className="h-64 w-full object-cover md:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-lg">
                <p className="text-lg font-semibold text-white md:text-xl">
                  &ldquo;We lost 3 days of production waiting for a single repair. That&apos;s ₹12 lakhs in downtime.&rdquo;
                </p>
                <p className="mt-2 text-sm text-white/70">— Factory Owner, Jharkhand Industrial Belt</p>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
