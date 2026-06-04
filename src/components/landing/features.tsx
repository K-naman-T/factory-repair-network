"use client"

import { MapPin, Cpu, Shield, Clock, Building2, Sparkles } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Sparkles,
    title: "5 Specialties",
    description: "HVAC, Plumbing, Electrical, Pest, Industrial",
  },
  {
    icon: MapPin,
    title: "Real-time Tracking",
    description: "Live job status updates from dispatch to completion",
  },
  {
    icon: Cpu,
    title: "Smart Matching",
    description: "AI-powered technician dispatch",
  },
  {
    icon: Shield,
    title: "Verified Technicians",
    description: "Rating and review system for quality assurance",
  },
  {
    icon: Clock,
    title: "Instant Response",
    description: "24-hour average response time",
  },
  {
    icon: Building2,
    title: "5 Cities",
    description: "Jamshedpur, Dhanbad, Ranchi, Bokaro, Hazaribagh",
  },
]

function FeatureCard({ icon: Icon, title, description }: typeof features[number]) {
  return (
    <div className={cn(
      "flex w-72 flex-col gap-3 rounded-xl border bg-card p-5",
      "shadow-sm transition-all hover:shadow-md"
    )}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade inView>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to fix your factory
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From dispatch to completion — we&apos;ve got you covered.
            </p>
          </div>
        </BlurFade>
      </div>

      <div className="mt-12 relative">
        <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <Marquee pauseOnHover className="[--duration:30s]">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
