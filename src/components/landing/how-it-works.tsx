"use client"

import { ClipboardList, GitCompare, Wrench } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"

const steps = [
  {
    Icon: ClipboardList,
    name: "Report",
    description: "Factory owner describes the issue in 30 seconds through our simple form.",
    className: "md:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />,
  },
  {
    Icon: GitCompare,
    name: "Match",
    description: "System matches the best technician by specialty & location using AI-powered dispatch.",
    className: "md:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />,
  },
  {
    Icon: Wrench,
    name: "Fix",
    description: "Technician arrives, diagnoses, and resolves the issue — verified through the platform.",
    className: "md:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to get your factory back online.
            </p>
          </div>
        </BlurFade>

        <div className="mt-12">
          <BlurFade inView delay={0.1}>
            <BentoGrid className="md:grid-cols-3 md:auto-rows-[18rem]">
              {steps.map((step) => (
                <BentoCard
                  key={step.name}
                  name={step.name}
                  className={step.className}
                  background={step.background}
                  Icon={step.Icon}
                  description={step.description}
                  href="#"
                  cta="Learn more"
                />
              ))}
            </BentoGrid>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
