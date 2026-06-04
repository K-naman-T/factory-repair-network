"use client"

import { AlertTriangle, Factory, Ban, Warehouse } from "lucide-react"
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
    <section className="bg-background py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
              <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
              The Problem
            </span>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <div className="mt-4 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Industrial repair in India is{" "}
              <span className="text-destructive">broken</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Factory equipment breaks down daily, yet there&apos;s no organized way to find, vet, and dispatch repair technicians.
            </p>
          </div>
        </BlurFade>

        <div className="mt-6 mx-auto max-w-lg text-center">
          <BlurFade inView delay={0.15}>
            <div className="inline-flex items-center gap-3 rounded-xl border bg-card px-6 py-3 shadow-sm">
              <span className="text-3xl font-bold text-destructive">78.5</span>
              <div className="text-left">
                <p className="text-sm font-medium">Severity Score</p>
                <p className="text-xs text-muted-foreground">Razorpay FixMyItch Index</p>
              </div>
            </div>
          </BlurFade>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {painPoints.map((point, i) => (
            <BlurFade key={point.title} inView delay={0.2 + i * 0.1}>
              <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-colors hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <point.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
