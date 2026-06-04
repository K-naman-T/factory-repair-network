"use client"

import { Building2, Users, Clock, Star } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { BlurFade } from "@/components/ui/blur-fade"

interface Stat {
  icon: typeof Building2
  value: number
  suffix: string
  label: string
  decimals?: number
}

const stats: Stat[] = [
  { icon: Building2, value: 500, suffix: "+", label: "Factories Served" },
  { icon: Users, value: 200, suffix: "+", label: "Technicians" },
  { icon: Clock, value: 24, suffix: "hr", label: "Average Response" },
  { icon: Star, value: 4.8, suffix: "★", label: "Average Rating", decimals: 1 },
]

export function StatsSection() {
  return (
    <section id="stats" className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              FixForge in Numbers
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/70">
              Trusted by factories across eastern India.
            </p>
          </div>
        </BlurFade>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <BlurFade key={stat.label} inView delay={0.1 + i * 0.1}>
              <div className="flex flex-col items-center gap-3 text-center">
                <stat.icon className="h-8 w-8 text-primary-foreground/70" />
                <span className="text-4xl font-bold text-primary-foreground md:text-5xl">
                  <NumberTicker value={stat.value} decimalPlaces={stat.decimals ?? 0} />
                  {stat.suffix}
                </span>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
