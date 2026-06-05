"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <BlurFade delay={0.1} inView>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              From Breakdown to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Fix in Hours
              </span>
              , Not Days
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              India&apos;s first on-demand marketplace connecting factory owners with qualified industrial repair technicians.
            </p>
          </BlurFade>

          <BlurFade delay={0.3} inView className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <ShimmerButton
                shimmerColor="#ffffff"
                background="linear-gradient(135deg, #6366f1, #8b5cf6)"
                className="text-base px-8 py-3"
              >
                Post a Repair Job
                <ArrowRight className="ml-2 h-4 w-4" />
              </ShimmerButton>
            </Link>
            <Link href="/register?type=technician">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-2">
                Find Technicians
              </Button>
            </Link>
          </BlurFade>

          <BlurFade delay={0.4} inView className="mt-16">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="grid md:grid-cols-2 divide-x">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/hero-industrial.jpg"
                    alt="Engineer inspecting industrial machinery"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-medium text-white/90">Expert technicians on demand</p>
                  </div>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/tech-repair.jpg"
                    alt="Technician repairing factory equipment"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-medium text-white/90">Same-day service across 5 cities</p>
                  </div>
                </div>
              </div>
              <BorderBeam size={200} duration={8} colorFrom="#6366f1" colorTo="#8b5cf6" />
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
